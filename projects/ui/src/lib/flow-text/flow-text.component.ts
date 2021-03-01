import {Component, Input, OnDestroy} from '@angular/core'
import {map, takeUntil} from 'rxjs/operators'
import {GrantStatusEnum} from '@services/static/static.model'
import {BehaviorSubject, combineLatest, Subject} from 'rxjs'
import {translate} from '@ngneat/transloco'
import {ContractGrantModel} from '@services/contract/contract.model'
import {LinkHttpPipe} from '@libs/pipes/link-http.pipe'
import {StaticService} from '@services/static/static.service'
import {UserService} from '@services/user/user.service'

@Component({
  selector: 'ui-flow-text',
  templateUrl: './flow-text.component.html',
  styleUrls: ['./flow-text.component.scss']
})
export class FlowTextComponent implements OnDestroy {

  private linkHttpPipe: LinkHttpPipe = new LinkHttpPipe()

  public readonly grantStatusEnum = GrantStatusEnum

  @Input() isShowStatus = false
  @Input() isShowFlow = false
  private grant$: BehaviorSubject<ContractGrantModel> = new BehaviorSubject<ContractGrantModel>({})

  @Input() set grant (data: ContractGrantModel) {
    if (data && data.id) {
      this.grant$.next(data)
    }
  }

  private readonly destroyed$ = new Subject()
  private status$: BehaviorSubject<string> = new BehaviorSubject<string>('')
  public content$ = combineLatest([this.staticService.selectedContact$, this.status$, this.grant$])
    .pipe(
      takeUntil(this.destroyed$),
      map(
        ([grantType, status, grant]) => {
          const param = this.prepareData(grant)
          const data = {
            status: translate(`listing.status.${status}`, param),
            flow: translate(`flow.${grantType}.${status}`, param)
          }
          return data
        }
      )
    )

  @Input() set status (data: string) {
    this.status$.next(data)
  }

  constructor (
    public staticService: StaticService, // eslint-disable-line
    public userService: UserService,
  ) {}

  private prepareData (grant: ContractGrantModel): {
    voteScore: string,
    votesAmount: string,
    performerName: string,
    reportLink: string,
    winnerName: string,
    teamsAmount: string,
    winnerIdentifier: string
  } {

    let voteScore = 0
    let votesAmount = 0
    if (grant.voted) {
      for (const key of Object.keys(grant.voted)) {
        votesAmount++
        voteScore += parseInt(grant.voted[key].value, 10)
      }
    }
    let performerName = ''
    if (grant.app) {
      grant.app.forEach(app => {
        if (app.process && app.name && app.name.value) {
          performerName = app.name.value
        }
      })
    }
    let reportLink = ''
    if (grant.report?.value) {
      reportLink = this.linkHttpPipe.transform(grant.report?.value)
    }

    const teamsAmount = (grant.app?.length || 0).toString()

    let winnerIdentifier = ''
    grant.app?.forEach(app => {
      if (app.process?.value === 'winner') {
        winnerIdentifier = app.id.value
      }
    })

    return {
      voteScore: voteScore.toString(),
      votesAmount: votesAmount.toString(),
      performerName,
      reportLink,
      winnerName: performerName,
      teamsAmount,
      winnerIdentifier
    }
  }

  ngOnDestroy (): void {
    this.destroyed$.next(null)
  }

}
