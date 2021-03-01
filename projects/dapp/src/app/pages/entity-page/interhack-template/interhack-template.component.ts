import {ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core'
import {ContractGrantAppModel, ContractGrantModel} from '@services/contract/contract.model'
import {GrantStatusEnum, GrantsVariationType} from '@services/static/static.model'
import {DisruptiveContractService} from '@services/contract/disruptive-contract.service'
import {MatSnackBar} from '@angular/material/snack-bar'
import {SignerService} from '@services/signer/signer.service'
import {filter, map, take, takeUntil, tap} from 'rxjs/operators'
import {translate} from '@ngneat/transloco'
import {DialogComponent} from '@ui/dialog/dialog.component'
import {ApplyComponent} from '@ui/modals/apply/apply.component'
import {
  SubmitCallBackAcceptWorkResultArg,
  SubmitCallBackApplyArg,
  SubmitCallBackRewardArg, SubmitCallBackSubmitSolutionResultArg
} from '@ui/dialog/dialog.tokens'
import {MatDialog} from '@angular/material/dialog'
import {
  TeamsAndSolutionsControlsInterface,
  TemplateComponentAbstract,
  VoteTeamEventInterface
} from '@pages/entity-page/entity.interface'
import {AddRewardComponent} from '@ui/modals/add-reward/add-reward.component'
import {UserService} from '@services/user/user.service'
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs'
import {SubmitSolutionComponent} from '@ui/modals/submit-solution/submit-solution.component'
import {
  isAcceptWorkResultBtnInterhack,
  isStopSubmissionsBtn,
  prepareIsEnableSubmissionsBtnData,
  prepareIsFinishVoteBtnData,
  prepareIsRejectBtnData,
  prepareIsShowAddRewardBtnData,
  prepareIsStartWorkBtnData,
  prepareSquareFakeBlockVotingData,
  prepareTeamsAndSolutionData,
  prepareTeamsAndSolutionHeaderData,
  prepareTitleTextData,
  teamsAndSolutionsControls,
} from './functions'
import {InterhackContractService} from '@services/contract/Interhack-contract.service'
import {ActivatedRoute} from '@angular/router'
import {IScore} from '@services/interface'
import {AcceptWorkResultInterhackComponent} from '@ui/modals/accept-work-result-interhack/accept-work-result-interhack.component'

@Component({
  selector: 'app-interhack-template',
  templateUrl: './interhack-template.component.html',
  styleUrls: ['./interhack-template.component.scss']
})
export class InterhackTemplateComponent implements TemplateComponentAbstract, OnDestroy {

  @Input() public readonly contract!: GrantsVariationType
  private readonly destroyed$ = new Subject()
  grantStatusEnum = GrantStatusEnum
  eScore = IScore.EStepType

  @Input() set grant (data: ContractGrantModel) {
    this.inputGrant = data
    this.prepareVoteForTaskData(data)
    this.grant$.next(data)
  }

  get grant (): ContractGrantModel {
    const grant = this.inputGrant
    if (
      this.inputGrant?.status?.value !== this.grantStatusEnum.noStatus
      && this.inputGrant?.status?.value !== this.grantStatusEnum.proposed
      && this.inputGrant?.status?.value !== this.grantStatusEnum.readyToApply
      && grant
      && grant.app
    ) {
      grant.app = grant?.app?.filter((e) => {
        const score = e.score?.applicant?.value
        if (score && score > 0) {
          return true
        }
      })
    }
    return grant
  }

  voteForTaskData = {
    isShow: false,
    isVote: false,
    isVoteInProcess: false
  }
  grant$ = new Subject<ContractGrantModel>()

  public readonly isStopSubmissionsBtn$: Observable<boolean> =
    combineLatest([this.userService.data, this.grant$])
      .pipe(
        takeUntil(this.destroyed$),
        map(([user, grant]) => isStopSubmissionsBtn(user, grant))
      )

  public readonly squareFakeBlockVoting$: Observable<boolean> =
    combineLatest([this.grant$, this.userService.data])
      .pipe(
        takeUntil(this.destroyed$),
        map(([grant]) => grant),
        map((grant) => prepareSquareFakeBlockVotingData(grant))
      )

  public readonly isEnableSubmissionsBtn$: Observable<boolean> =
    combineLatest([this.userService.data, this.grant$])
      .pipe(
        takeUntil(this.destroyed$),
        map(([user, grant]) => prepareIsEnableSubmissionsBtnData(user, grant))
      )

  public titleText$: Observable<string> = combineLatest([this.grant$])
    .pipe(
      takeUntil(this.destroyed$),
      map(([grant]): string => prepareTitleTextData(grant)),
    )

  stepType$: BehaviorSubject<IScore.EStepType> = new BehaviorSubject<IScore.EStepType>(IScore.EStepType.team)

  teamsAndSolutionsControls$: Observable<TeamsAndSolutionsControlsInterface> = combineLatest(
    [this.userService.data, this.grant$])
    .pipe(
      takeUntil(this.destroyed$),
      map(([user, grant]) => teamsAndSolutionsControls(user, grant)),
      tap(e =>
        e.stepType === IScore.EStepType.team
          ? this.stepType$.next(IScore.EStepType.team)
          : this.stepType$.next(IScore.EStepType.solution)
      )
    )

  public readonly isShowAllTeamsBtn$: Observable<boolean> = this.grant$
    .pipe(
      takeUntil(this.destroyed$),
      map(e => typeof e?.status?.value === 'string' ? e.status.value : ''),
      map(e =>
        e === GrantStatusEnum.workStarted
        || e === GrantStatusEnum.workFinished
        || e === GrantStatusEnum.solutionChosen
      ),
    )

  winnerSolutionId$: BehaviorSubject<string> = new BehaviorSubject<string>('')
  winnerSolutionId = ''
  solutionIdList: string[] = []
  public readonly winnerSolution$ = this.grant$
    .pipe(
      takeUntil(this.destroyed$),
      filter(e => e !== null && e.app !== undefined && e.app.length > 0),
      map((e: ContractGrantModel): ContractGrantAppModel[] => e.app as ContractGrantAppModel[]),
      map((e: ContractGrantAppModel[]) => {
        let solution = e[0]
        const solutionIdList: string[] = []
        e.forEach(e => {

          const eScore = e.score?.solution?.value || 0
          const sScore = solution.score?.solution?.value || 0

          if(eScore > 0 && e.key) {
            solutionIdList.push(e.key)
          }

          if (eScore >= sScore) {
            solution = e
          }

        })
        return {key: solution.key as string, solutionIdList}
      })
    )
    .subscribe((e) => {
      this.winnerSolutionId = e.key
      this.winnerSolutionId$.next(e.key)
      this.solutionIdList = e.solutionIdList
    })


  public readonly isStartWorkBtn$: Observable<boolean> =
    combineLatest([this.userService.data, this.grant$])
      .pipe(
        takeUntil(this.destroyed$),
        map(([user, grant]) => prepareIsStartWorkBtnData(user, grant))
      )

  public readonly isFinishVoteBtn$: Observable<boolean> =
    combineLatest([this.userService.data, this.grant$])
      .pipe(
        takeUntil(this.destroyed$),
        map(([user, grant]): boolean => prepareIsFinishVoteBtnData(grant, user))
      )

  public readonly isAcceptWorkResultBtn$: Observable<boolean> =
    combineLatest([this.userService.data, this.grant$])
      .pipe(
        takeUntil(this.destroyed$),
        map(([user, grant]) => isAcceptWorkResultBtnInterhack(user, grant))
      )

  public readonly isRejectBtn$: Observable<boolean> =
    combineLatest([this.userService.data, this.grant$])
      .pipe(
        takeUntil(this.destroyed$),
        map(([user, grant]) => prepareIsRejectBtnData(grant, user))
      )

  isShowAddRewardBtn$ = combineLatest([this.userService.data, this.grant$])
    .pipe(
      takeUntil(this.destroyed$),
      map(([user, grant]) => prepareIsShowAddRewardBtnData(grant, user))
    )

  private user$ = this.userService.data
    .pipe(
      takeUntil(this.destroyed$),
      filter(() => this.inputGrant?.id !== undefined)
    )
    .subscribe(() => this.prepareVoteForTaskData(this.inputGrant))

  private inputGrant: ContractGrantModel = {}

  public readonly teamsAndSolutionHeader$: Observable<IScore.IHeader> = combineLatest(
    [
      this.grant$,
      this.userService.data,
      this.userService.isBalanceMoreCommission$,
      this.titleText$,
      this.teamsAndSolutionsControls$
    ])
    .pipe(
      filter(([grant]) => grant !== null && grant !== undefined),
      map(([grant, user, isBalance, titleText, controls]): IScore.IHeader =>
        prepareTeamsAndSolutionHeaderData(grant, user, isBalance, titleText, controls))
    )


  public readonly teamsAndSolution$: Observable<IScore.IUnit[]> = combineLatest(
    [
      this.grant$,
      this.userService.data,
      this.teamsAndSolutionsControls$,
      this.stepType$,
      this.squareFakeBlockVoting$,
      this.winnerSolutionId$
    ]
  )
    .pipe(
      takeUntil(this.destroyed$),
      filter(([grant]) => grant !== null && grant !== undefined),
      map(([grant, user, controls, step, fake, winnerSolutionId]) => {
          grant = grant
          user = user
          controls = controls
          fake = fake
          winnerSolutionId = winnerSolutionId
          return prepareTeamsAndSolutionData(grant, user, controls, step.toString() , fake, winnerSolutionId)
        }
      )
    )

  constructor (
    private route: ActivatedRoute, // eslint-disable-line
    private readonly dialog: MatDialog, // eslint-disable-line
    public disruptiveContractService: DisruptiveContractService, // eslint-disable-line
    public interhackContractService: InterhackContractService,// eslint-disable-line
    private readonly snackBar: MatSnackBar,// eslint-disable-line
    public signerService: SignerService,// eslint-disable-line
    private readonly cdr: ChangeDetectorRef,// eslint-disable-line
    public userService: UserService// eslint-disable-line
  ) {
  }

  vote (value: 'like' | 'dislike'): void {
    const id = this.grant.id || ''
    this.voteForTaskData.isVoteInProcess = true
    this.disruptiveContractService.voteForTaskProposal(id, value).subscribe({
      complete: () => {
        this.voteForTaskData.isVoteInProcess = false
        this.cdr.markForCheck()
      }
    })
  }

  signup (): void {
    this.signerService.login()
      .pipe(take(1))
      .subscribe(() => {
      }, (error) => {
        this.snackBar.open(error, translate('messages.ok'))
      })
  }

  openApplyModal (): void {
    const dialog = this.dialog.open(DialogComponent, {
      width: '500px',
      maxWidth: '100vw',
      data: {
        component: ApplyComponent,
        params: {
          grant: this.grant,
          submitCallBack: (data: SubmitCallBackApplyArg) => {
            this.disruptiveContractService.applyForTask(data.id, data.team, data.link)
              .pipe(take(1))
              .subscribe(() => {
                dialog.close()
                this.cdr.markForCheck()
              })
          }
        }
      }
    })
  }

  voteTeam ($event: VoteTeamEventInterface): void {
    if (this.grant?.status?.value === GrantStatusEnum.readyToApply) {
      this.disruptiveContractService.voteForApplicant(this.grant?.id as string, $event.teamIdentifier, $event.voteValue).subscribe()
    }
  }

  finishVote (): void {
    this.disruptiveContractService.finishTaskProposalVoting(this.grant?.id as string).subscribe()
  }

  startWork (): void {
    this.disruptiveContractService.startWork(this.grant?.id as string).subscribe()
  }

  reject (): void {
    this.disruptiveContractService.rejectTask(this.grant?.id as string).subscribe()
  }

  acceptWorkResult (): void {
    const dialog = this.dialog.open(DialogComponent, {
      width: '500px',
      maxWidth: '100vw',
      data: {
        component: AcceptWorkResultInterhackComponent,
        params: {
          title: translate('modal.texts.accept_work_result'),
          submitBtnText: translate('modal.btn.apply'),
          proposedWinner: this.winnerSolutionId,
          solutionIdList: this.solutionIdList,
          submitCallBack: (data: SubmitCallBackAcceptWorkResultArg) => {
            if (this.grant?.id && data.winnerTeamId) {
              this.interhackContractService.acceptWorkResult(
                this.grant?.id,
                data.winnerTeamId,
                data.reportLink
              ).subscribe()
            }
            dialog.close()
            this.cdr.markForCheck()
          }
        }
      }
    })
  }

  finishApplicantsVote (): void {
    this.interhackContractService.finishApplicantsVoting(this.grant?.id as string).subscribe()
    // this.disruptiveContractService.finishApplicantsVoting(this.grant?.id as string).subscribe()
  }

  addReward (): void {
    const dialog = this.dialog.open(DialogComponent, {
      width: '500px',
      maxWidth: '100vw',
      data: {
        component: AddRewardComponent,
        params: {
          title: !this.grant?.status?.value ? translate('entity.add_reward') : translate('entity.edit_task_details'),
          submitBtnText: translate('modal.btn.propose_grant'),
          grantId: this.grant?.id,
          submitCallBack: (data: SubmitCallBackRewardArg) => {
            const id = this.grant?.id
            const reward = parseInt(data.reward, 10).toString()
            if (id) {
              this.disruptiveContractService.addReward(id, reward).subscribe()
            }
            dialog.close()
            this.cdr.markForCheck()
          }
        }
      }
    })
  }

  enableSubmissions (): void {
    if (this.grant?.id) {
      this.disruptiveContractService.enableSubmissions(this.grant?.id, '').subscribe(() => {
      })
    }
  }

  submitSolution (): void {
    const dialog = this.dialog.open(DialogComponent, {
      width: '500px',
      maxWidth: '100vw',
      data: {
        component: SubmitSolutionComponent,
        params: {
          title: translate('entity.submit_solution'),
          submitBtnText: translate('modal.btn.propose_grant'),
          grantId: this.grant?.id,
          submitCallBack: (data: SubmitCallBackSubmitSolutionResultArg) => {
            const id = this.grant?.id
            if (id) {
              this.disruptiveContractService.submitSolution(id, data.solutionLink).subscribe()
            }
            dialog.close()
            this.cdr.markForCheck()
          }
        }
      }
    })
  }

  voteSolution ($event: VoteTeamEventInterface): void {
    if (this.grant?.id) {
      this.disruptiveContractService.voteForSolution(
        this.grant?.id, $event.teamIdentifier, $event.voteValue).subscribe()
    }
  }

  stopSubmissions (): void {
    if (this.grant?.id) {
      this.disruptiveContractService.stopSubmissions(this.grant?.id).subscribe()
    }
  }

  private prepareVoteForTaskData (grant: ContractGrantModel = this.inputGrant) {
    if (
      this.userService.data.getValue().roles.isDAO &&
      grant?.status?.value === this.grantStatusEnum.proposed &&
      grant?.reward?.value
    ) {
      this.voteForTaskData.isShow = true
    } else {
      this.voteForTaskData.isShow = false
    }
    if (grant && grant.id && this.userService.data.getValue().voted.includes(grant.id)) {
      this.voteForTaskData.isVote = true
    } else {
      this.voteForTaskData.isVote = false
    }
  }

  ngOnDestroy (): void {
    this.destroyed$.next()
  }
}
