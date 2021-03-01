import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject,
  Input,
  OnDestroy,
} from '@angular/core'
import {GRANTS, GRANTS_PROVIDERS} from './listing.providers'
import {
  ContractGrantModel, ContractGrantRawModel, GrantParams,
} from '@services/contract/contract.model'
import {LoadingWrapperModel} from '@libs/loading-wrapper/loading-wrapper'
import {
  API,
  APP_CONSTANTS,
  AppApiInterface,
  AppConstantsInterface
} from '@constants'
import {UserService} from '@services/user/user.service'
import {map, publishReplay, refCount} from 'rxjs/operators'
import {ContractService} from '@services/contract/contract.service'

import {BehaviorSubject, combineLatest, Observable} from 'rxjs'
import {translate} from '@ngneat/transloco'
import {
  GrantStatusEnum,
  GrantsVariationType, GrantTypesEnum,
} from '@services/static/static.model'
import {ActivatedRoute} from '@angular/router'
import { Async } from '@libs/decorators/async-input.decorator'
import {UserDataInterface} from '@services/user/user.interface'

@Component({
  selector: 'ui-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: GRANTS_PROVIDERS
})
export class ListingComponent implements OnDestroy {
  statusPriority = []

  @Input() public type: 'default' | 'active' | undefined

  @Async() @Input('contract') public readonly contract$!: Observable<GrantsVariationType>

  public readonly grantsVariationActive = '1'
  public readonly grantStatusEnum = GrantStatusEnum
  public selectedTagName$ = new BehaviorSubject<string>('all')

  public readonly listGrantStatuses$: Observable<string[]> = this.grants.data$.pipe(
    map((grants: ContractGrantRawModel[]): string[] =>
        grants instanceof Array ? Object.values(
            grants.reduce<{[s: string]: string}>(
                (origin, grant) => ({
                  ...origin,
                  ...(grant?.status?.value === undefined
                    ? {[GrantStatusEnum.noStatus]: GrantStatusEnum.noStatus}
                    : {[grant?.status?.value]: grant?.status?.value})
                }), {})) : []),
    map((list: string[]) => list.length > 0 ? ['all'].concat(list as []) : list.length === 1 ? ['all'] : []))

  public readonly user$ = this.userService.data

  public readonly grantsList$: Observable<ContractGrantModel[]> = combineLatest(
    [this.grants.data$, this.userService.data, this.selectedTagName$, this.contract$]
  )
    .pipe(
      map(([grants, userServiceData, selectedTagName, contract]) => grants
          .filter((grant: ContractGrantRawModel) => [
            grant?.status?.value || GrantStatusEnum.noStatus,
            'all'].includes(selectedTagName))
          .map((grant: ContractGrantRawModel): ContractGrantModel => {
            const label = this.createLabel(grant, userServiceData, contract)

            return {
              ...grant,
              app: grant.app ? Object.values(grant.app) : [],
              // Check labels with attribute grant in lang file
              label
            }
          })
          .sort(this.sort)
      ),
      publishReplay(1),
      refCount()
    )

  public otherGrantList$: Observable<ContractGrantModel[] | null> = this.grantsList$
  .pipe(
      map((grants) => grants
        .filter((grant: ContractGrantModel) => !grant?.label?.important)
      ),
      map(grants => grants.length > 0 ? grants : null)
  )

  public importantGrantList$: Observable<ContractGrantModel[] | null> = this.grantsList$
  .pipe(
      map((grants) => grants
          .filter((grant: ContractGrantModel) => !!grant?.label?.important)
      ),
      map(grants => grants.length > 0 ? grants : null)
  )

  constructor (
    public route: ActivatedRoute,
    public cdr: ChangeDetectorRef,
    @Inject(APP_CONSTANTS) public readonly constants: AppConstantsInterface,
    @Inject(API) public readonly api: AppApiInterface,
    @Inject(GRANTS) public readonly grants: LoadingWrapperModel<ContractGrantRawModel[]>,
    public userService: UserService,
    public contractService: ContractService
  ) {}

  selectTag ($event: string): void {
    this.selectedTagName$.next($event)
  }

  ngOnDestroy (): void {
    this.grants.destroy()
  }

  private sort (grantA: ContractGrantModel, grantB: ContractGrantModel): number {
    // TODO check this function

    let weight = 0
    // First priority, status
    if (grantA?.status?.value === GrantStatusEnum.rejected) {
      weight = weight + 4
    }
    if (grantB?.status?.value === GrantStatusEnum.rejected) {
      weight = weight - 4
    }

    // priority, zero reward
    if (!grantA?.reward?.value) {
      weight = weight + 2
    }
    if (!grantB?.reward?.value) {
      weight = weight - 2
    }

    // priority, finished grant
    if (grantA?.status?.value === GrantStatusEnum.workFinished) {
      weight = weight + 3
    }
    if (grantB?.status?.value === GrantStatusEnum.workFinished) {
      weight = weight - 3
    }

    // priority, grant with label
    if (!!grantA?.label?.label) {
      weight = weight - 3
    }
    if (grantB?.label?.label) {
      weight = weight + 3
    }

    // Thirty priority, date
    // Todo realize date in contracts

    return weight
  }

  private createLabel (grant: ContractGrantRawModel, userServiceData: UserDataInterface, contract: GrantsVariationType): GrantParams {
    let params: GrantParams = {}

    params = {
      ...params,
      ...this.getStatusProperties(grant, userServiceData)
    }

    const labelRole = userServiceData?.userRole || 'undefined'
    const labelStatus = grant?.status?.value || 'undefined'
    const labelContract = contract?.name || 'undefined'
    const labelImportant = params?.important === true ? 'true' : params?.important === false ? 'false' : 'undefined'


    const label = translate(
        `listing.labels.${labelContract}.${labelRole}.${labelStatus}.${labelImportant}`, params)

    return {
      ...params,
      label: label.indexOf('listing.labels') === 0 ? null : label,
    }
  }

  getStatusProperties (grant: ContractGrantRawModel, userServiceData: UserDataInterface): GrantParams {
    switch(grant?.status?.value) {
      case GrantStatusEnum.readyToApply:
        return {
          count: (grant?.app && Object.keys(grant?.app).length || '0').toString(),
          important: userServiceData.roles.isAuth ?
              grant?.applicants && grant?.applicants?.value.indexOf(userServiceData?.userAddress) >= 0 : undefined
        }
      case GrantStatusEnum.proposed:
        return {
          amount: grant?.voting?.amount?.value || '0',
          score: grant?.voting?.state?.value || '0',
          important: userServiceData.roles.isDAO ? !(grant?.voted && grant?.voted[userServiceData?.userAddress]) : undefined
        }
      case GrantTypesEnum.web3:

        break
    }
    return {}
  }
}
