import {Component, EventEmitter, Input, Output} from '@angular/core'
import {IScore} from '@services/interface'
import {VoteEventInterface} from '@pages/entity-page/entity.interface'
import {ContractGrantModel} from '@services/contract/contract.model'

@Component({
  selector: 'ui-score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.scss']
})
export class ScoreListComponent{
  @Input() titleText: string | null = null
  @Input() applyBtnText: string | null = null
  @Input() list: IScore.IUnit[] = []
  @Input() grant: ContractGrantModel | null = null
  @Input() header: IScore.IHeader | null = null
  @Output() newSignupEvent = new EventEmitter()
  @Output() newVoteEvent = new EventEmitter<VoteEventInterface>()
  @Output() newOpenApplyModalEvent = new EventEmitter()
  @Output() newSubmitSolutionEvent = new EventEmitter()
}
