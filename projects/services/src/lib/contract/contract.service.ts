import { Inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {
  map,
  publishReplay,
  refCount,
  skip,
  switchMap, take, tap
} from 'rxjs/operators'
import { API, AppApiInterface } from '@constants'
import { BehaviorSubject, combineLatest, Observable } from 'rxjs'
import {
  ContractDataIterationModel,
  ContractDataModel, ContractGrantFullAppModel, ContractGrantModel,
  ContractGrantRawModel,
  ContractRawData,
  ContractRawDataEntityId,
  ContractRawDataString
} from './contract.model'
import { StorageService } from '@services/storage/storage.service'
import { TranslocoService } from '@ngneat/transloco'
import { GrantStatusEnum } from '@services/static/static.model'
import { MembershipService } from '@services/membership/membership.service'
import { RequestsService } from '@services/requests-service/requests.service'

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private readonly contractAddress$: BehaviorSubject<string> =
  new BehaviorSubject(this.storageService.contactAddress || this.api.contracts.web3)

  private readonly contractState = this.contractAddress$.pipe(
    switchMap((address) => this.getContractData(address)),
    publishReplay(1),
    refCount()
  )

  public readonly stream: Observable<ContractDataModel> = combineLatest([this.contractState, this.membershipService.stream]).pipe(
    map(([data, members]) => ({
      ...data,
      ...members
    })),
    tap((data) => {
      console.log('CONTRACT DATA', data)
    }),
    publishReplay(1),
    refCount()
  )

  public readonly streamTasks: Observable<ContractGrantRawModel[]> = this.contractState.pipe(map((contract) =>
    Object.keys(contract?.tasks || {}).map((entityKey: string) => ({
      ...contract?.tasks[entityKey],
      id: entityKey
    }))))

  public entityById (entityId: ContractRawDataEntityId): Observable<ContractGrantModel> {
    return this.stream.pipe(
      map((data: ContractDataModel) => {
        const grant: ContractGrantRawModel = data.tasks[entityId]

        return {
          ...grant,
          isShowAppliers: ![
            '',
            GrantStatusEnum.noStatus.toString(),
            GrantStatusEnum.proposed.toString()
          ].includes(grant?.status?.value || ''),
          app: grant.app ? Object.keys(grant.app).map((appKey) => ({
            ...grant?.app?.[appKey],
            key: appKey
          })) : [],
          id: entityId
        } as ContractGrantModel
      })
    )
  }

  public getAddress (): string {
    return this.contractAddress$.getValue()
  }

  public applicants: string[] = []

  constructor (
    private readonly http: HttpClient, // eslint-disable-line
    private storageService: StorageService, // eslint-disable-line
    private readonly translocoService: TranslocoService, // eslint-disable-line
    private readonly membershipService: MembershipService, // eslint-disable-line
    private readonly requestsService: RequestsService, // eslint-disable-line
    @Inject(API) private readonly api: AppApiInterface // eslint-disable-line
  ) {
  }

  public getContractData (address: string): Observable<ContractGrantFullAppModel> {
    return this.requestsService.getContractData(address).pipe(
      map((data: ContractRawData) => ({
        ...this.prepareData(data),
        address
      }))
    )
  }

  public refresh (address: string = this.getAddress()): Observable<ContractDataModel> {
    this.storageService.contactAddress = address
    this.contractAddress$.next(address)
    return this.contractState.pipe(skip(1), take(1))
  }

  public switchContract (type: string | undefined): void {
    if (!type) {
      return
    }

    const contracts = this.api.contracts as { [s: string]: string }

    if (!contracts[type]) {
      throw new Error('ContractService::switchContract | Contract ' + type + ' is not found ')
    }
    this.refresh(contracts[type])
  }

  private group (
    keys: string[],
    context: ContractDataIterationModel,
    value: ContractRawDataString
  ): ContractDataIterationModel | undefined {
    const key: string | undefined = keys.shift()
    if (!key) {
      return undefined
    }

    if (!context[key]) {
      context[key] = keys.length === 0 ? value : {}
    }
    return this.group(keys, context[key], value)
  }

  private prepareData (data: ContractRawData): ContractDataModel {
    return data.reduce((orig, item) => {
      const keys = item.key.split('_')
      this.group(keys, orig, item)
      return orig
    }, {}) as ContractDataModel
  }
}
