import {ContractGrantModel} from '@services/contract/contract.model'
import {UserDataInterface} from '@services/user/user.interface'
import {GrantStatusEnum} from '@services/static/static.model'
import {TeamsAndSolutionsControlsInterface} from '@pages/entity-page/entity.interface'
import {IScore} from '@services/interface'
import {LinkHttpPipe} from '@libs/pipes/link-http.pipe'
import {translate} from '@ngneat/transloco'
import {teamsControls} from '@pages/entity-page/disruptive-template/functions'

const linkHttpPipe: LinkHttpPipe = new LinkHttpPipe()

export const teamsAndSolutionsControls = (user: UserDataInterface, grant: ContractGrantModel): TeamsAndSolutionsControlsInterface => {
  const result: TeamsAndSolutionsControlsInterface = {
    isShowSolutionControls: true,
    stepType: 'team',
    isApplyBtn: false,
    isSubmitSolutionBtn: false,
    isShowAllTeam: false,
    teamVoteKeys: [],
    solutionVoteKeys: [],
    leaderIds: [],
    isShow: true
  }
  if (grant && grant.status && grant.status.value && grant.app) {
    // isShowSolutionControls
    const status = grant.status.value
    if (
      status === GrantStatusEnum.solutionChosen ||
      status === GrantStatusEnum.rejected
    ) {
      result.isShowSolutionControls = false
    }

    // stepType
    if (
      status === GrantStatusEnum.noStatus
      || status === GrantStatusEnum.proposed
      || status === GrantStatusEnum.readyToApply
      // status === GrantStatusEnum.workStarted ||
      // status === GrantStatusEnum.proposed ||
      // status === GrantStatusEnum.readyToApply
      // // || status === GrantStatusEnum.workStarted
    ) {
      result.stepType = IScore.EStepType.team
    } else {
      result.stepType = IScore.EStepType.solution
    }
    // isApplyBtn
    if (user.roles.isAuth && status === GrantStatusEnum.readyToApply) {
      result.isApplyBtn = true
    } else {
      result.isApplyBtn = false
    }
    // isSubmitSolutionBtn
    if (user.roles.isAuth && status === GrantStatusEnum.workStarted) {
      result.isSubmitSolutionBtn = true
      grant.app.forEach((app) => {
        const id = app.leader.value
        const score = app?.score?.applicant?.value || 0
        if (app.solution && app.solution.key.includes(user.userAddress.slice(-15))) {
          result.isSubmitSolutionBtn = false
        } else if (
          id === user.userAddress
          && score < 1
        ) {
          result.isSubmitSolutionBtn = false
        }
      })
    } else {
      result.isSubmitSolutionBtn = false
    }
    // isShowAllTeam
    if (
      status === GrantStatusEnum.noStatus ||
      status === GrantStatusEnum.proposed ||
      status === GrantStatusEnum.readyToApply
    ) {
      result.isShowAllTeam = true
    } else {
      result.isShowAllTeam = false
    }
    // teamVoteKeys
    let userKey = user.userAddress.slice(-15)
    const teamKeys: string[] = []
    if (!!grant && grant.app) {
      grant.app.forEach((e) => {
        if (e.key) {
          teamKeys.push(userKey + e.key)
        }
      })
    }
    teamKeys.forEach((key) => {
      if (grant.vh && grant.vh[key]) {
        result.teamVoteKeys.push(key.slice(-25))
      }
    })
    // solutionVoteKeys
    grant.app.forEach((app) => {
      if (app.voted && app.voted.solution) {
        result.solutionVoteKeys = app.voted.solution.value.split(';').filter(x => x) || []
      }
    })
    userKey = user.userAddress
    // leaderIds
    grant.app.forEach((app) => {
      result.leaderIds.push(app.leader.value)
    })
    // isShow
    if (grant.status.value === GrantStatusEnum.rejected && grant.app.length === 0) {
      result.isShow = false
    }
  }
  return result
}

export const isAcceptWorkResultBtnInterhack = (user: UserDataInterface, grant: ContractGrantModel): boolean => {
  if (grant && grant.app) {
    const isWG = user.roles.isWG
    let isVote = false
    if (grant.app.length) {
      grant.app.forEach((app) => {
        if (app.voted && app.voted.solution && app.voted.solution.value) {
          isVote = true
        }
      })
    }
    const isStatusMatch = grant?.status?.value === GrantStatusEnum.workFinished
    return isVote && isWG && isStatusMatch
  } else {
    return false
  }
}

export const teamsAndSolutionTypeTeam = (
  grant: ContractGrantModel, user: UserDataInterface, controls: TeamsAndSolutionsControlsInterface
): IScore.IUnit[] => {

  const res: IScore.IUnit[] = []
  const apps = grant.app || []

  apps.forEach(app => {

    const appKey: string = app.key || ''
    const isCanVote = (!controls.teamVoteKeys.includes(appKey)
      || GrantStatusEnum.readyToApply !== grant?.status?.value)
      && GrantStatusEnum.rejected !== grant?.status?.value
      && GrantStatusEnum.workStarted !== grant?.status?.value

    const unit: IScore.IUnit = {
      isWinner: false,
      isPerformer: !!app.process?.value,
      isWinnerIcon: !!app.process?.value,
      isPerformerIcon: true,
      name: app.name.value,
      solutionLink: null,
      status: {
        isSolution: false,
        isRejected: false,
        isApprove: false
      },
      square: {
        score: app?.score?.applicant?.value || 0,
        id: app?.id?.value || '',
        isCanVote,
        isShowResult: !user.roles.isDAO,
      },
      teamLink: linkHttpPipe.transform(app?.link?.value)
    }

    res.push(unit)

  })

  return res

}

export const teamsAndSolutionTypeSolution = (
  grant: ContractGrantModel,
  user: UserDataInterface,
  controls: TeamsAndSolutionsControlsInterface,
  fake: boolean,
  winnerSolutionId: string
): IScore.IUnit[] => {

  const res: IScore.IUnit[] = []
  const apps = grant.app || []

  apps.forEach(app => {

    const isSolution = !!app?.solution?.value
    const isCanVote: boolean =
      !app?.voted?.solution?.value.includes(user.userAddress)
      && GrantStatusEnum.solutionChosen !== grant?.status?.value
      && GrantStatusEnum.rejected !== grant?.status?.value
      && !fake
      && isSolution
    const isWinner: boolean =
      GrantStatusEnum.solutionChosen === grant?.status?.value
      && !!app?.process
      && app?.id?.value === winnerSolutionId

    const unit: IScore.IUnit = {
      isWinner,
      isPerformer: false,
      isWinnerIcon: true,
      isPerformerIcon: true,
      name: app.name.value,
      solutionLink: app?.solution?.value ? app?.solution?.value : null,
      status: {
        isSolution: app?.solution?.value ? true : false,
        isRejected: false,
        isApprove: false
      },
      square: {
        score: app?.score?.solution?.value || 0,
        id: app?.id?.value || '',
        isCanVote,
        isShowResult: !user.roles.isDAO,
      },
      teamLink: linkHttpPipe.transform(app?.link?.value)
    }

    const applicantScore = app?.score?.applicant?.value || 0

    if (applicantScore > 0)
      {res.push(unit)}

  })

  return res
}

export const isStopSubmissionsBtn = (user: UserDataInterface, grant: ContractGrantModel): boolean => {
  const isStatusMatch = grant?.status?.value === GrantStatusEnum.workStarted
  let isVoteForSolution = false
  if (grant.app) {
    grant.app.forEach((app) => {
      if (app.solution) {
        isVoteForSolution = true
      }
    })
  }
  const isWG = user.roles.isWG
  return isVoteForSolution && isWG && isStatusMatch
}

export const prepareSquareFakeBlockVotingData = (grant: ContractGrantModel): boolean => {
  const isStatusMatch = grant?.status?.value === GrantStatusEnum.workStarted
  let isVoteForSolution = false
  if (grant.app) {
    grant.app.forEach((app) => {
      if (app.solution) {
        isVoteForSolution = true
      }
    })
  }
  return isVoteForSolution && isStatusMatch
}

export const prepareIsEnableSubmissionsBtnData = (user: UserDataInterface, grant: ContractGrantModel): boolean => {
  if (grant && grant.app) {
    let isVoteForTeam = false
    grant.app.forEach((app) => {
      if (app && app.voted && app.votes) {
        isVoteForTeam = true
      }
    })
    const isTeamApply = grant.app.length > 0
    const isRole = user.roles.isWG
    const isStatusMatch = grant?.status?.value === GrantStatusEnum.readyToApply
    return isVoteForTeam && isTeamApply && isRole && isStatusMatch
  } else {
    return false
  }
}

export const prepareTitleTextData = (grant: ContractGrantModel): string => {
  const grantStatus = grant?.status?.value || GrantStatusEnum.noStatus
  if (
    (
      grantStatus === GrantStatusEnum.noStatus
      || grantStatus === GrantStatusEnum.proposed
      || grantStatus === GrantStatusEnum.readyToApply
    )
  ) {
    return translate('entity.applied_teams')
  } else {
    return translate('entity.solutions')
  }
}

export const prepareIsStartWorkBtnData = (user: UserDataInterface, grant: ContractGrantModel): boolean => {
  if (grant) {
    const isTL = grant.leader?.value === user.userAddress
    const isStatusMatch = grant.status?.value === GrantStatusEnum.approved
    return isTL && isStatusMatch
  } else {
    return false
  }
}

export const prepareTeamsAndSolutionHeaderData = (
  grant: ContractGrantModel,
  user: UserDataInterface,
  isBalance: boolean,
  titleText: string,
  controls: TeamsAndSolutionsControlsInterface
): IScore.IHeader => {

  let isLeader = false
  let isProcess = false

  grant?.app?.forEach(app => {
    if (!!app.process?.value) {
      isProcess = true
    }
    if (app.leader.value === user.userAddress) {
      isLeader = true
    }
  })

  const res: IScore.IHeader = {
    applyBtnText: translate('entity.apply'),
    isApplyBtn: teamsControls(user, grant).isApplyBtn || false,
    isBalanceMoreCommission: isBalance !== false,
    isShowAppliers: grant?.isShowAppliers || false,
    isUnauthorized: user.roles.isUnauthorized,
    titleText,
    isSubmitSolutionBtn: controls.isSubmitSolutionBtn && isLeader,
    isShowLogInForApplyBtn: user.roles.isUnauthorized && !isProcess
  }

  return res
}

export const prepareIsFinishVoteBtnData = (grant: ContractGrantModel, user: UserDataInterface): boolean => {
  if (grant) {
    const isAmount = grant?.voting?.amount || false
    const isStatusMatch = grant?.status?.value === GrantStatusEnum.proposed
    const isWG = user.roles.isWG
    return isAmount && isWG && isStatusMatch
  } else {
    return false
  }
}

export const prepareIsShowAddRewardBtnData = (grant: ContractGrantModel, user: UserDataInterface): boolean => {
  if (grant) {
    const isWG = user.roles.isWG
    const isNoReward = !grant?.reward?.value
    const isStatusMatch = !grant?.status?.value ||
      grant?.status?.value === GrantStatusEnum.proposed ||
      grant?.status?.value === GrantStatusEnum.readyToApply ||
      grant?.status?.value === GrantStatusEnum.teamChosen
    return isNoReward && isWG && isStatusMatch
  } else {
    return false
  }
}

export const prepareTeamsAndSolutionData = (
  grant: ContractGrantModel,
  user: UserDataInterface,
  controls: TeamsAndSolutionsControlsInterface,
  step: string,
  fake: boolean,
  winnerSolutionId: string
): IScore.IUnit[] => {
  if (step === IScore.EStepType.team) {
    return teamsAndSolutionTypeTeam(grant, user, controls)
  } else {
    return teamsAndSolutionTypeSolution(grant, user, controls, fake, winnerSolutionId)
  }

}

export const prepareIsRejectBtnData = (grant: ContractGrantModel, user: UserDataInterface): boolean => {
  if (grant) {
    const isWG = user.roles.isWG
    const isStatusMatch = grant?.status?.value !== GrantStatusEnum.rejected
    return isWG && isStatusMatch
  } else {
    return false
  }
}
