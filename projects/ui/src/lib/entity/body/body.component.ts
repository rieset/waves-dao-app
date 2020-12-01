import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { environment } from '@dapp/src/environments/environment'
import { ContractGrantModel } from '@services/contract/contract.model'

@Component({
  selector: 'ui-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  environment: {
    showDevTools: boolean;
  } = environment;

  mdTemp: string | null = null
  @Input() set md (value: string | null) {
    this.mdTemp = value
    this.cdr.markForCheck()
  }

  get md (): string | null {
    return this.mdTemp
  }

  @Input() link: string | null = null
  @Input() grant: ContractGrantModel | null = null

  constructor (public cdr: ChangeDetectorRef) {}

  ngOnInit (): void {
  }
}