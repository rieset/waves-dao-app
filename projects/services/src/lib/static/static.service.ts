import {Inject, Injectable} from '@angular/core'
import {BehaviorSubject, combineLatest, Observable} from 'rxjs'
import {filter, map, publishReplay, refCount, tap} from 'rxjs/operators'
import {ContractService} from '@services/contract/contract.service'
import {UserService} from '@services/user/user.service'
import {RolesInterface} from '@services/user/user.interface'
import {GrantsVariationType, GrantTypesEnum} from './static.model'
import {translate, TranslocoService} from '@ngneat/transloco'
import {API, AppApiInterface} from '@constants'

@Injectable({
  providedIn: 'root'
})
export class StaticService {
  public selectedContact$: BehaviorSubject<GrantTypesEnum> = new BehaviorSubject<GrantTypesEnum>(GrantTypesEnum.disruptive)

  constructor(
    private readonly contractService: ContractService, // eslint-disable-line
    private readonly userService: UserService, // eslint-disable-line
    private readonly translocoService: TranslocoService, // eslint-disable-line
    @Inject(API) private readonly api: AppApiInterface // eslint-disable-line
  ) {
  }

  public getContactsList(): Observable<GrantsVariationType[]> {

    const contracts = this.api.contracts as { [s: string]: string }

    const res = this.translocoService.selectTranslateObject('contracts')
      .pipe(
        map((data: { [s: string]: GrantsVariationType }) => Object.keys(data).map((key) => ({
          ...data[key],
          name: key,
          type: contracts[key] || null
        } as GrantsVariationType))),
        publishReplay(1),
        refCount()
      )
    res.subscribe(e => {
    })

    return res
  }

  getContactInfo (contactType: string): Observable<GrantsVariationType | null> {
    return this.getContactsList().pipe(
      map((contracts: GrantsVariationType[]) => contracts.find((item) => item.name === contactType) || null)
    )
  }

  getStaticContract (contractType: GrantTypesEnum): Observable<GrantsVariationType> {
    this.contractService.switchContract(contractType)
    this.selectedContact$.next(contractType)
    return combineLatest([
      this.getContactInfo(contractType),
      this.userService.data
    ]).pipe(
      filter(([contract, user]) => !!contract && !!user),
      map(([contractInfo, user]) => {
        if (!contractInfo) {
          throw new Error(translate('messages.errors.contract_not_found'))
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
    return roles.isManager
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
