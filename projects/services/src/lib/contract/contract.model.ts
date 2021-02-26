export type ContractRawDataKey = string
export type ContractRawDataValue = string
export type ContractRawDataTypeString = 'string'
export type ContractRawDataTypeNumber = 'integer'

export type ContractRawDataEntityId = string

export interface ContractRawDataString {
  key: ContractRawDataKey
  value: ContractRawDataValue
  type: ContractRawDataTypeString | ContractRawDataTypeNumber
}

export interface ContractRawDataNumber {
  key: ContractRawDataKey
  value: ContractRawDataValue
  type: ContractRawDataTypeNumber
}

export interface TeamsScoreLinkModel {
  name: string,
  link: string,
  score: number | string
}

export type ContractRawData = ContractRawDataString[]
export interface ContractGrantExtendedParentModel {
  grants: ContractGrantExtendedModel[]
  selectedTag: string
  isDAO: boolean
}
export interface ContractGrantFullAppModel {
  manager: string
  address: string
  working: {
    group: {
      member: {
        [s: string]: { weight: ContractRawDataString
        }
      }
      name: ContractRawDataString
      size: ContractRawDataNumber
    }
  }
  dao: {
    member: {[s: string]: {
      weight: ContractRawDataString
    }}
    members: ContractRawDataString
    size: ContractRawDataNumber
  }
  tasks: {[s: string]: ContractGrantRawModel}
}

export interface ContractGrantAppModel {
  id: ContractRawDataString
  leader: ContractRawDataString
  name: ContractRawDataString
  link: ContractRawDataString
  key?: string
  manager?: string
  process?: {
    key: string
    type: string
    value: string
  }
  report?: {
    key: string
    type: string
    value: string
  }
  score?: {
    key: string
    type: string
    value: string
    applicant?: {
      key: string
      type: string
      value: number
    }
    solution?: {
      key: string
      type: string
      value: number
    }
  }
  voted: {
    key: string
    type: string
    value: string
    solution?: {
      key: string
      type: string
      value: string
    }
  }
  solution?: {
    key: string
    type: string
    value: string
  }
  votes?: {
    key?: string
    type?: string
    value?: string,
    applicant?: {
      key: string
      type: string
      value: string
    }
    solution?: {
      key: string
      type: string
      value: string
    }
  }
}

export interface ContractGrantCommonModel {
  id?: ContractRawDataEntityId
  app?: {[s: string]: ContractGrantAppModel} | ContractGrantAppModel[]

  applicants?: ContractRawDataString
  link?: ContractRawDataString
  reward?: ContractRawDataNumber
  status?: ContractRawDataString
  title?: ContractRawDataString
  vh?: {[s: string]: ContractRawDataString}
  voted?: {[s: string]: ContractRawDataString}
  voting?: {
    amount?: ContractRawDataNumber
    state?: ContractRawDataNumber
  }
}

export interface ContractDataIterationModel {
  [s: string]: any // eslint-disable-line
}

export interface ContractGrantRawModel extends ContractGrantCommonModel {
  leader?: {
    key: string
    type: string
    value: string
  }
  app?: {[s: string]: ContractGrantAppModel}
}

export interface GrantParams {
  amount?: string,
  score?: string,
  count?: string,
  max?: string,
  min?: string
  label?: string
  important?: boolean
  winnerName?: string
  allTeamVoteScore?: string
  solutionCount?: string
  teamVoteScore?: string
}

export interface ContractGrantModel extends ContractGrantCommonModel {
  app?: ContractGrantAppModel[]
  id?: ContractRawDataEntityId
  performer?: ContractRawDataString
  link?: ContractRawDataString
  leader?: ContractRawDataString
  isShowAppliers?: boolean
  report?: ContractRawDataString,
  label?: GrantParams
}

export interface ContractGrantExtendedModel extends ContractGrantModel {
  grants: ContractGrantExtendedModel[]
  voteText?: string
  statusText?: string
  rewardText?: string
  canBeCompleted?: string[]
}

export interface ContractGrantExtendedParentModel extends ContractGrantExtendedModel{
  grants: ContractGrantExtendedModel[]
  selectedTag: string
  isDAO: boolean
}

export interface ContractDataModel {
  address: string
  manager: string
  working: {
    group: {
      member: {[s: string]: {
        weight: ContractRawDataString
      }}
      name: ContractRawDataString
      size: ContractRawDataNumber
    }
  }
  dao: {
    member: {[s: string]: {
      weight: ContractRawDataString
    }}
    members: ContractRawDataString
    size: ContractRawDataNumber
  }
  tasks: {[s: string]: ContractGrantRawModel}
}
