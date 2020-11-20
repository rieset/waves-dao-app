import {Inject, Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {
  map,
  publishReplay,
  refCount,
  repeatWhen,
  switchMap, takeUntil,
  tap
} from 'rxjs/operators'
import {API, AppApiInterface} from '@constants'
import {BehaviorSubject, Observable, Subject} from 'rxjs'
import {
  ContractDataModel, ContractGrantCommonModel, ContractGrantModel,
  ContractGrantRawModel,
  ContractRawData,
  ContractRawDataEntityId,
  ContractRawDataNumber,
  ContractRawDataString
} from './contract.model'
import {SignerService} from '@services/signer/signer.service'
import {InvokeResponseInterface} from '../../interface'
import {PopupService} from '@services/popup/popup.service'
import {AddTextObjInterface} from "@services/popup/popup.interface";

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiGetAddressData = new URL('/addresses/data/' + this.api.contractAddress, this.api.rest)
  private contractRefresh$: Subject<null> = new Subject()
  private averageOperationSpeed = 5000
  public applicants: string[] = []
  // @ts-ignore
  private contractState$: BehaviorSubject<ContractDataModel> = new BehaviorSubject(
    {})

  private readonly contractState = this.http.get<Observable<ContractRawData>>(this.apiGetAddressData.href, {
    headers: {
      accept: 'application/json; charset=utf-8'
    }
  }).pipe(
    // @ts-ignore
    repeatWhen(() => this.contractRefresh$),
    map((data: ContractRawData) => {
      return this.prepareData(data)
    }),
    switchMap((data: ContractDataModel) => {
      this.contractState$.next(data)
      return this.contractState$.pipe(takeUntil(this.contractRefresh$))
    }),
    tap((data) => {
      console.log('Origin contract data :: projects/services/src/lib/contract/contract.service.ts: 47\n\n', data)

      // this.defineApplicants(data)
    }),
    publishReplay(1),
    refCount()
  )

  public readonly stream: Observable<ContractDataModel> = this.contractState.pipe(
    publishReplay(1),
    refCount()
  )

  public readonly streamTasks: Observable<ContractGrantRawModel[]> = this.contractState.pipe(map((contract) => {
    return Object.keys(contract?.tasks).map((entityKey: string) => {
      return {
        ...contract?.tasks[entityKey],
        id: entityKey
      }
    })
  }))

  constructor(
    private readonly http: HttpClient,
    @Inject(API) private readonly api: AppApiInterface,
    private readonly signerService: SignerService,
    private popupService: PopupService
  ) {
  }

  refresh() {
    this.contractRefresh$.next(null)
    this.popupService.add('refresh' as unknown as AddTextObjInterface)
  }

  // private defineApplicants(data: ContractDataModel) {
  //
  //   let applicants: string[] = []
  //
  //     console.log('task -----', data.tasks)
  //   data.tasks.key
  // }
  private group(keys: string[], context: { [s: string]: object }, value: ContractRawDataString | ContractRawDataNumber): void {
    // Todo поправить типизацию, пришлось лезть в контракт и переделывать структуру данных
    // @ts-ignore
    const key: string = keys.shift()

    if (!key) {
      return
    }

    if (!context[key]) {
      context[key] = keys.length === 0 ? value : {}
    }

    // Todo поправить типизацию, пришлось лезть в контракт и переделывать структуру данных
    // @ts-ignore
    return this.group(keys, context[key], value)
  }

  private prepareData(data: ContractRawData): ContractDataModel {
    // Todo поправить типизацию, пришлось лезть в контракт и переделывать структуру данных
    // @ts-ignore
    return data.reduce((orig, item) => {
      const keys = item.key.split('_')
      this.group(keys, orig, item)
      return orig
    }, {})
  }

  public entityById(entityId: ContractRawDataEntityId): Observable<ContractGrantModel> {
    return this.stream.pipe(map((data: ContractDataModel) => {
      const grant: ContractGrantRawModel = data.tasks[entityId]

      return {
        ...grant,
        app: grant.app ? Object.keys(grant.app).map((appKey) => {
          return {
            ...grant?.app?.[appKey],
            key: appKey
          }
        }) : [],
        id: entityId
      } as ContractGrantModel
    }))
  }

  // dapp

  public addDAOMember(members: string) {
    this.signerService.invoke('addDAOMember', [
      {type: 'string', value: members}
    ])
      .catch((res) => {
        this.popupService.add(res, 'addDAOMember catch')
      })
      .then((res) => {
        this.popupService.add(res as unknown as AddTextObjInterface, 'addDAOMember then')
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
      .finally(() => {
        this.popupService.add(' ' as unknown as AddTextObjInterface, "addDAOMember finally")
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
  }

  public addGroupMember(members: string) {
    this.signerService.invoke('addGroupMember', [
      {type: 'string', value: members}
    ])
      .catch((res) => {
        this.popupService.add(res, 'addGroupMember catch')
      })
      .then((res) => {
        this.popupService.add(res as unknown as AddTextObjInterface, 'addGroupMember then')
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
      .finally(() => {
        this.popupService.add(' ' as unknown as AddTextObjInterface, "addGroupMember finally")
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
  }

  public addTask(taskName: string, reward: number, link: string) {
    const tx = this.signerService.invoke('addTask', [
      {type: 'string', value: taskName},
      {type: 'string', value: link}
    ])
      .catch((res) => {
        this.popupService.add(res, 'addTask catch')
      })
      .then((res) => {
        this.popupService.add(res as unknown as AddTextObjInterface, 'addTask then')
        if (reward) {
          const result = res as unknown as InvokeResponseInterface
          this.addTaskDetails(result.id, reward)
        }
      })
      .finally(() => {
        this.popupService.add(' ' as unknown as AddTextObjInterface, "addTask finally")
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
  }

  public addTaskDetails(taskId: string, reward: number) {
    this.signerService.invoke('addTaskDetails',
      [{type: 'string', value: taskId}],
      [{assetId: 'WAVES', amount: reward}])
      .catch((res) => {
        this.popupService.add(res, 'addTaskDetails catch')
      })
      .then((res) => {
        this.popupService.add(res as unknown as AddTextObjInterface, 'addTaskDetails then')
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
      .finally(() => {
        this.popupService.add(' ' as unknown as AddTextObjInterface, "addTaskDetails finally")
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
  }

  public voteForTaskProposal(taskId: string, voteValue: 'like' | 'dislike') {
    this.signerService.invoke('voteForTaskProposal', [
      {type: 'string', value: taskId},
      {type: 'string', value: voteValue}
    ])
      .catch((res) => {
        this.popupService.add(res, "voteForTaskProposal this")
      })
      .then((res) => {
        this.popupService.add(res as unknown as AddTextObjInterface, "voteForTaskProposal then")
      })
      .finally(() => {
        this.popupService.add(' ' as unknown as AddTextObjInterface, "voteForTaskProposal finally")
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
  }

  public finishTaskProposalVoting(taskId: string) {
    this.signerService.invoke('finishTaskProposalVoting', [
      {type: 'string', value: taskId}
    ])
      .catch((res) => {
        this.popupService.add(res, 'finishTaskProposalVoting')
      })
      .then((res) => {
        this.popupService.add(res as unknown as AddTextObjInterface, 'finishTaskProposalVoting then')
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
      .finally(() => {
        this.popupService.add(' ' as unknown as AddTextObjInterface, "finishTaskProposalVoting finally")
      })
  }

  public applyForTask(taskId: string, teamName: string, link: string) {
    this.signerService.invoke('applyForTask', [
      {type: 'string', value: taskId},
      {type: 'string', value: teamName},
      {type: 'string', value: link}
    ])
      .then((res) => {
        this.popupService.add(res as unknown as AddTextObjInterface, 'applyForTask then')
      })
      .catch((res) => {
        this.popupService.add(res, 'applyForTask catch')
      })
      .finally(() => {
        this.popupService.add(' ' as unknown as AddTextObjInterface, 'applyForTask finally')
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
  }

  public voteForApplicant(taskId: string, teamIdentifier: string, voteValue: string) {
    this.signerService.invoke('voteForApplicant', [
      {type: 'string', value: taskId},
      {type: 'string', value: teamIdentifier},
      {type: 'string', value: voteValue}
    ])
      .catch((res) => {
        this.popupService.add(res, 'voteForApplicant catch')
      })
      .then(res => {
        this.popupService.add(res as unknown as AddTextObjInterface, 'voteForApplicant catch')
      })
      .finally(() => {
        this.popupService.add(' ' as unknown as AddTextObjInterface, 'voteForApplicant finally')
      })
  }

  public finishApplicantsVoting(taskId: string) {
    this.signerService.invoke('finishApplicantsVoting', [
      {type: 'string', value: taskId}
    ])
      .catch((res) => {
        this.popupService.add(res, 'finishApplicantsVoting catch')
      })
      .then((res) => {
        this.popupService.add(res as unknown as AddTextObjInterface, 'finishApplicantsVoting then')
      })
      .finally(() => {
        this.popupService.add(' ' as unknown as AddTextObjInterface, 'finishApplicantsVoting finally')
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
  }

  public startWork(taskId: string) {
    this.signerService.invoke('startWork', [
      {type: 'string', value: taskId}
    ])
      .catch((res) => {
        this.popupService.add(res, 'startWork catch')
      })
      .then((res) => {
        this.popupService.add(res as unknown as AddTextObjInterface, 'startWork then')
      })
      .finally(() => {
        this.popupService.add(' ' as unknown as AddTextObjInterface, 'startWork finally')
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
  }

  public acceptWorkResult(taskId: string) {
    this.signerService.invoke('acceptWorkResult', [
      {type: 'string', value: taskId}
    ])
      .catch((res) => {
        this.popupService.add(res, 'acceptWorkResult catch')
      })
      .then((res) => {
        this.popupService.add(res as unknown as AddTextObjInterface, 'acceptWorkResult then')
      })
      .finally(() => {
        this.popupService.add(' ' as unknown as AddTextObjInterface, 'acceptWorkResult finally')
        setTimeout(() => {
          this.refresh()
        }, this.averageOperationSpeed)
      })
  }
}
