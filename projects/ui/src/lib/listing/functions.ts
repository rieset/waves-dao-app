import {
  ContractGrantAppModel,
  ContractGrantExtendedModel,
  ContractGrantModel,
  ContractRawDataNumber
} from '@services/contract/contract.model'
import {GrantStatusEnum, GrantTypesEnum} from '@services/static/static.model'
import {UserDataInterface} from '@services/user/user.interface'
// import {isAcceptWorkResultBtnInterhack} from "@pages/entity-page/interhack-template/functions";

export const fixReward = (grants: ContractGrantModel[]): ContractGrantModel[] => grants.map((e) => {
    if (e.reward && e.reward.value && typeof e.reward.value === 'number') {
      e.reward.value = (e.reward.value / 100000000).toFixed(2)
    } else if (e.reward === undefined) {
      const newData: ContractRawDataNumber = {
        key: '', type: 0, value: '0.00'
      }
      e.reward = newData
    }
    return e
  })

export const sortOtherGrant = (data: ContractGrantExtendedModel[]): ContractGrantExtendedModel[] => {
  const normList: ContractGrantExtendedModel[] = []
  const rejectedList: ContractGrantExtendedModel[] = []
  const noStatusList: ContractGrantExtendedModel[] = []
  if (data)
    {data.forEach((grant) => {
      if (grant.status) {
        if (grant.status && grant.status.value !== GrantStatusEnum.rejected) {
          normList.push(grant)
        } else {
          rejectedList.push(grant)
        }
      } else {
        noStatusList.push(grant)
      }
    })}
  return [...normList, ...noStatusList, ...rejectedList]
}

export const canBeCompleted = (
  grants: ContractGrantExtendedModel[],
  contractType: GrantTypesEnum,
  user: UserDataInterface
): string[] => {
  const res: string[] = []
  if (contractType === GrantTypesEnum.interhack) {
    grants.forEach((grant) => {
      let tempRes = false
      const apps: ContractGrantAppModel[] | undefined = grant.app
      if(apps) {
        const isWG = user.roles.isWG
        let isVote = false
        for (const app of apps) {
            isVote = !!app?.voted?.solution?.value
        }
        const isStatusMatch = grant?.status?.value === GrantStatusEnum.workFinished
        tempRes = isVote && isWG && isStatusMatch
      }
      if (tempRes && grant.id) {
        res.push(grant.id)
      }
    })
  } else if (contractType === GrantTypesEnum.disruptive) {
    grants.forEach((grant) => {
      if (grant && grant.app && grant.status && grant.status.value === GrantStatusEnum.workStarted) {
        let r = false
        const apps: ContractGrantAppModel[] | undefined = grant.app
        for (const app of apps) {
            r = !!(app && app.process && app.process.value && app.process.value === GrantStatusEnum.workStarted &&
                app.leader.value === user.userAddress)
        }
        if(r && grant.id) {
          res.push(grant.id)
        }
      }
    })
  } else {
    grants.forEach((grant) => {
      if (grant) {
        const isWG = user.roles.isWG
        const isStatusMatch = grant?.status?.value === GrantStatusEnum.workStarted
        if (isWG && isStatusMatch && grant.id) {
          res.push(grant.id)
        }
      }
    })
  }
  return res
}