export interface GrantUrl {
  contractType: string,
  entityId: string
}

export namespace IScore {
  export interface IUnit {
    name: string
    isWinner: boolean
    isPerformer: boolean
    isWinnerIcon: boolean
    isPerformerIcon: boolean
    teamLink: string | null
    solutionLink: string | null
    square: ISquare
    status: IStatus
  }
  export interface IStatus {
    isSolution: boolean
    isRejected: boolean
    isApprove: boolean
  }
  export interface ISquare {
    score: number | string
    id: string
    isCanVote: boolean
    isShowResult: boolean
  }
  export interface ISort {
    by: 'team' | 'solution'
  }
  export enum EStepType {
    team = 'team',
    solution = 'solution'
  }
  export interface IHeader {
    titleText: string | null
    applyBtnText: string | null
    isShowAppliers: boolean
    isUnauthorized: boolean
    isBalanceMoreCommission: boolean
    isApplyBtn: boolean
    isShowLogInForApplyBtn: boolean
    isSubmitSolutionBtn?: boolean
  }
}

