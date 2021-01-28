// eslint-disable
export enum RoleEnum {
  unauthorized = 'unauthorized',
  authorized = 'authorized',
  daoMember = 'DAOMember',
  workingGroup = 'workingGroup',
  master = 'master',
  owner = 'owner'
}

export interface RolesInterface {
  isMaster: boolean
  isDAO: boolean
  isWG: boolean
  isAuth: boolean
  isUnauthorized: boolean
  isOwner: boolean
}

export interface RoleRowInterface {
  mainRole: RoleEnum
  roles: RolesInterface
}

export interface UserDataInterface {
  userRole: RoleEnum
  userAddress: string
  addressDAOMember: string[]
  addressWorkGroup: string[]
  masterAddress: string
  roles: RolesInterface
  voted: string[]
  apply: string[]
  balance: string
  owner: string
}
