import {Component, Inject, OnInit} from '@angular/core'
import {FormControl, FormGroup} from '@angular/forms'
import {UserService} from '@services/user/user.service'
import {DIALOG_DATA, DialogParams} from '@ui/dialog/dialog.tokens'

@Component({
  selector: 'ui-finish-applicants-voting',
  templateUrl: './finish-applicants-voting.component.html',
  styleUrls: ['./finish-applicants-voting.component.scss']
})
export class FinishApplicantsVotingComponent implements OnInit {

  form = new FormGroup({
    winnerId: new FormControl('')
  })

  constructor (
    public userService: UserService, // eslint-disable-line
    @Inject(DIALOG_DATA) public params: DialogParams // eslint-disable-line
  ) { }

  ngOnInit (): void {
    this.form.patchValue({
      winnerId: this.params.proposedWinner,
    })
  }

  onSubmit (): void {
    if (this.params.submitCallBack ) {
      this.params.submitCallBack({
        winnerTeamId: this.form?.value?.winnerId
      })
    }
  }
}
