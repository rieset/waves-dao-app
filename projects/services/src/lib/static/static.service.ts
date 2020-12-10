import { Inject, Injectable } from '@angular/core'
import { combineLatest, Observable } from 'rxjs'
import { map, publishReplay, refCount } from 'rxjs/operators'
import { ContractService } from '@services/contract/contract.service'
import { UserService } from '@services/user/user.service'
import { RolesInterface } from '@services/user/user.interface'
import { GrantsVariationType, GrantTypesEnum } from './static.model'
import { TranslocoService } from '@ngneat/transloco'
import { API, AppApiInterface } from '@constants'

@Injectable({
  providedIn: 'root'
})
export class StaticService {
  constructor (
      private contractService: ContractService,
      private userService: UserService,
      private translocoService: TranslocoService,
      @Inject(API) private readonly api: AppApiInterface
  ) { }

  public selectedContact: GrantTypesEnum = GrantTypesEnum.disruptive

  public getContactsList (): Observable<GrantsVariationType[]> {
    const contracts = this.api.contracts as { [s: string]: string }

    return this.translocoService.selectTranslateObject('contracts').pipe(
      map((data: {[s: string]: GrantsVariationType}) => {
        return Object.keys(data).map((key) => {
          return {
            ...data[key],
            name: key,
            type: contracts[key] || null
          } as GrantsVariationType
        })
      }),
      publishReplay(1),
      refCount()
    )
  }

  getContactInfo (contactType: string): Observable<GrantsVariationType | null> {
    return this.getContactsList().pipe(
      map((contracts: GrantsVariationType[]) => {
        return contracts.find((item) => item.name === contactType) || null
      })
    )
  }

  getStaticContract (contractType: GrantTypesEnum) {
    this.contractService.switchContract(contractType)
    this.selectedContact = contractType

    return combineLatest([
      this.getContactInfo(contractType),
      this.userService.data
    ]).pipe(
      map(([contractInfo, user]) => {
        if (!contractInfo) {
          throw new Error('Contact is not found')
        }

        return {
          ...contractInfo,
          permissionCreateGrant: this.checkPermissionCreateGrant(contractInfo.name, user.roles),
          permissionFinishCreateGrant: this.checkPermissionFinishCreateGrant(contractInfo.name, user.roles),
          permissionVote: this.checkPermissionVoted(contractInfo.name, user.roles),
          permissionSettings: this.checkPermissionSettings(contractInfo.name, user.roles)
        }
      })
    )
  }

  checkPermissionSettings (contractType: string, roles: RolesInterface): boolean {
    return roles.isMaster
  }

  checkPermissionCreateGrant (contractType: string, roles: RolesInterface): boolean {
    return contractType === GrantTypesEnum.web3 ? roles.isAuth : roles.isWG
  }

  checkPermissionFinishCreateGrant (contractType: string, roles: RolesInterface): boolean {
    return contractType === GrantTypesEnum.web3 ? roles.isAuth : roles.isWG
  }

  checkPermissionVoted (contractType: string, roles: RolesInterface): boolean {
    return roles.isDAO
  }
}