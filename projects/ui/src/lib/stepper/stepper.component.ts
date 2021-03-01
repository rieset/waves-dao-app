import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core'
import { MatStepper } from '@angular/material/stepper'
import { GrantStatusEnum } from '@services/static/static.model'
import { StepperService } from '@services/stepper/stepper.service'
import { combineLatest, Subject } from 'rxjs'
import { tap } from 'rxjs/operators'

@Component({
  selector: 'ui-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements AfterViewInit {
  @ViewChild('stepper') stepper: MatStepper | undefined
  grantStatusEnum = GrantStatusEnum
  grantStatus: string[] = []
  stepId = 0
  formalStatuses = this.stepperService.getFormalStatuses()
  setId$ = new Subject()
  stepperInit$ = new Subject()
  step$ = combineLatest([this.setId$, this.stepperInit$]).pipe(
    tap(([id, init]) => {
      if (id && typeof id === 'number' && init != null && this.stepper != null) {
        this.stepper.selectedIndex = id
        this.cdr.markForCheck()
      }
    })
  ).subscribe()

  @Input() set setType (type: 'disruptive' | 'interhack' | 'web3') {
    this.stepperService.setType(type)
    this.formalStatuses = this.stepperService.getFormalStatuses()
  }

  get setType (): 'disruptive' | 'interhack' | 'web3' {
    return this.stepperService.grantType
  }

  private statusInput = ''
  @Input() set status (data: string) {
    if (data?.length > 0) {
      this.statusInput = data
      this.stepId = this.stepperService.getActiveId(data)
      setTimeout(() => {
        this.stepId = this.stepperService.getActiveId(data)
      }, 100)
      if (this.stepId >= 0) {
        this.setId$.next(this.stepId)
      }
    } else {
      this.statusInput = 'no_status'
      this.stepId = this.stepperService.getActiveId('no_status')
      this.setId$.next(0)
    }
  }

  get status (): string {
    return this.statusInput
  }

  constructor (private readonly cdr: ChangeDetectorRef, public stepperService: StepperService) { // eslint-disable-line

  }

  ngAfterViewInit (): void {
    if (this.stepper != null) {
      // TODO проверить нужно ли переопределять приватный метод он может изменится
      // eslint-disable-next-line
      this.stepper._getIndicatorType = () => 'number'
      this.stepperInit$.next(true)
    }
  }
}
