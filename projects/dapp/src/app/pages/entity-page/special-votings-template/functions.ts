import { UserDataInterface } from '@services/user/user.interface'
import { ContractGrantModel } from '@services/contract/contract.model'
import { GrantStatusEnum } from '@services/static/static.model'
import { TeamsControlsInterface } from '@pages/entity-page/entity.interface'
import {IScore} from '@services/interface'
import {translate} from '@ngneat/transloco'
import {LinkHttpPipe} from '@libs/pipes/link-http.pipe'

const linkHttpPipe = new LinkHttpPipe()

export const isFinishApplicantsVoteBtn = (user: UserDataInterface, grant: ContractGrantModel): boolean => {
  if (grant && grant.app) {
    const isStatusMatch = grant?.status?.value === GrantStatusEnum.readyToApply
    const isWG = user.roles.isWG
    let isVote = false
    grant.app.forEach((app) => {
      if (app.voted) {
        isVote = true
      }
    })
    return isVote && isWG && isStatusMatch
  } else {
    return false
  }
}

export const getWinnerTeamId = (grant: ContractGrantModel): string => {
  const res = {
    key: '',
    score: 0
  }
  if (grant.app) {
    grant.app.forEach((app) => {
      if (app.key && app.score && app.score.value) {
        const score = parseInt(app.score.value, 10)
        if (res.score <= score) {
          res.key = app.key
          res.score = score
        }
      }
    })
  }
  return res.key
}

export const isAcceptWorkResultBtn = (user: UserDataInterface, grant: ContractGrantModel): boolean => {
  let result = false
  if (grant && grant.app && grant.status && grant.status.value === GrantStatusEnum.workStarted) {
    let isPerformer = false
    const isWG = user.roles.isWG
    grant.app.forEach((app) => {
      if (
        app && app.process && app.process.value && app.process.value === GrantStatusEnum.workStarted
        // && app.leader.value === user.userAddress
      ) {
        isPerformer = true
      }
    })
    result = isPerformer && isWG
  }
  return result
}

export const teamsControls = (user: UserDataInterface, grant: ContractGrantModel): TeamsControlsInterface => {

  const result: TeamsControlsInterface = {
    isVoteControls: 'show',
    voteFor: [],
    isApplyBtn: false
  }

  // isApplyBtn
  if (user.roles.isAuth && grant && grant.app && grant.status && grant.status.value) {
    const status = grant.status.value
    if (GrantStatusEnum.readyToApply === status) {
      result.isApplyBtn = true
    }
    grant.app.forEach((app) => {
      if (app.leader && app.leader.value && app.leader.value === user.userAddress) {
        result.isApplyBtn = false
      }
    })
  }

  // isVoteControls
  if (grant.app) {
    grant.app.forEach((app) => {
      if (app.key && app.voted && app.voted.value && app.voted.value.includes(user.userAddress)) {
        result.voteFor.push(app.key)
      }
    })
  }

  if (grant && grant.status && grant.status.value && grant.status.value === GrantStatusEnum.readyToApply) {
    result.isVoteControls = 'show'
  } else {
    result.isVoteControls = 'hidden'
  }

  return result

}

export const isStartWorkBtn = (user: UserDataInterface, grant: ContractGrantModel): boolean => {
  let result = false
  const temp = {
    leader: '',
    score: 0
  }
  if (grant && grant.app) {
    grant.app.forEach((app) => {
      // if (app.leader && app.score && app.score.value) {
      //   const score = parseInt(app.score.value, 10)
      //   if (temp.score <= score) {
      //     temp.leader = app.leader.value
      //     temp.score = score
      //   }
      // }
      if(app?.process?.value && app?.score?.value) {
        const score = parseInt(app.score.value, 10)
        temp.leader = app.leader.value
        temp.score = score
      }
    })
  }
  if (grant && grant.status && grant.status.value === GrantStatusEnum.teamChosen && temp.leader === user.userAddress) {
    result = true
  }
  return result
}

export const isShowAddRewardBtn = (user: UserDataInterface, grant: ContractGrantModel): boolean => {
  if (grant) {
    const isWG = user.roles.isWG
    const isNoReward = !grant?.reward?.value
    const isStatusMatch =
      !grant?.status?.value ||
      grant?.status?.value === GrantStatusEnum.proposed ||
      grant?.status?.value === GrantStatusEnum.readyToApply ||
      grant?.status?.value === GrantStatusEnum.teamChosen
    return isNoReward && isWG && isStatusMatch
  } else {
    return false
  }
}

export const isFinishVoteBtn = (user: UserDataInterface, grant: ContractGrantModel): boolean => {

  if (grant && grant.app) {

    const isVoted = !!grant.voted
    const isStatusMatch = grant?.status?.value === GrantStatusEnum.proposed
    const isWG = user.roles.isWG

    return isVoted && isWG && isStatusMatch

  } else {

    return false

  }

}

export const prepareTeamsHeaderData = (
  grant: ContractGrantModel,
  user: UserDataInterface,
  isBalance: boolean
): IScore.IHeader => {

  let isProcess = false
  grant?.app?.forEach( app => {
    if(!!app.process?.value) {
      isProcess = true
    }
  })

  const res: IScore.IHeader = {
    applyBtnText: translate('entity.apply'),
    isApplyBtn: teamsControls(user, grant).isApplyBtn || false,
    isBalanceMoreCommission: isBalance !== false,
    isShowAppliers: grant?.isShowAppliers || false,
    isUnauthorized: user.roles.isUnauthorized,
    titleText: translate('entity.teams'),
    isShowLogInForApplyBtn: user.roles.isUnauthorized && !isProcess
  }

  return res

}

export const prepareTeamsData = (
  grant: ContractGrantModel,
  user: UserDataInterface,
  isProcess: boolean
): IScore.IUnit[] => {

  const res: IScore.IUnit[] = []
  const apps = grant.app || []
  const controls = teamsControls(user, grant)

  apps.forEach(app => {

    const isCanVote =
      (!(controls?.isVoteControls === 'hidden')&& GrantStatusEnum.rejected !== grant?.status?.value)
      && !controls?.voteFor.includes(app?.id?.value)
    const score = app?.score?.value || 0

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
        score: app.score?.value || 0,
        id: app?.id?.value || '',
        isCanVote,
        isShowResult: !user.roles.isDAO,
      },
      teamLink: linkHttpPipe.transform(app?.link?.value)
    }

    if(isProcess && score> 0 || !isProcess) {
      res.push(unit)
    }

  })

  return res

}

export const prepareIsRejectBtnData = (
  grant: ContractGrantModel,
  user: UserDataInterface,
): boolean => {

  if (grant) {

    const isWG = user.roles.isWG
    const isStatusMatch = grant?.status?.value !== GrantStatusEnum.rejected

    return isWG && isStatusMatch

  } else {

    return false

  }

}

