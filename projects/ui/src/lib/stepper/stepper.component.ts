import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import {GrantStatusEnum} from '@services/static/static.model';
import {StepperService} from '@services/stepper/stepper.service';
import {combineLatest, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'ui-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit, AfterViewInit {

  grantStatusEnum = GrantStatusEnum
  grantStatus: string[] = []
  stepId: null | number = null
  formalStatuses = this.stepperService.getFormalStatuses()
  setId$ = new Subject();
  stepperInit$ = new Subject();

  GSstatus = ''
  @Input() set status (data: string) {
    if (data) {
      this.GSstatus = data
      this.stepId = this.stepperService.getActiveId(data)
      if (this.stepId) {
        this.setId$.next(this.stepId)
      }
    } else {
      this.GSstatus = 'no_status'
    }
  }
  get status (): string {
    return this.GSstatus
  }

  step$ = combineLatest([this.setId$, this.stepperInit$]).pipe(
    tap(([id, init]) => {
      if (id && typeof id === 'number' && init && this.stepper) {
        this.stepper.selectedIndex = id
        this.cdr.markForCheck()
      }
    })
  ).subscribe()



  @ViewChild('stepper') stepper: MatStepper | undefined;

  constructor (private cdr: ChangeDetectorRef, public stepperService: StepperService) {
  }

  ngOnInit () {
  }

  ngAfterViewInit () {
    if (this.stepper) {
      this.stepper._getIndicatorType = () => 'number'
      this.stepperInit$.next(true)
    }
  }

}