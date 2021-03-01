import {Component, Inject, OnInit} from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { API, AppApiInterface } from '@constants'
import { DIALOG_DATA, DialogParams } from '@ui/dialog/dialog.tokens'

@Component({
  selector: 'ui-accept-work-result-interhack',
  templateUrl: './accept-work-result-interhack.component.html',
  styleUrls: ['./accept-work-result-interhack.component.scss']
})
export class AcceptWorkResultInterhackComponent implements OnInit {
  public readonly form = new FormGroup({
    reportLink: new FormControl('', Validators.required),
    winnerId: new FormControl('')
  })

  constructor (
    @Inject(API) public readonly api: AppApiInterface,
    @Inject(DIALOG_DATA) public params: DialogParams
  ) { }

  ngOnInit (): void {
    this.form.patchValue({
      winnerId: this.params.proposedWinner,
    })
  }

  onSubmit (): void {
    if (this.params.submitCallBack) {
      this.params.submitCallBack({
        reportLink: this.form.value.reportLink,
        winnerTeamId: this.form.value.winnerId
      })
    }
  }
}
