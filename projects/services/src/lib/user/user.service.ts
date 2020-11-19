import {Injectable} from '@angular/core'
import {RoleEnum, RoleRowInterface, UserDataInterface} from '@services/user/user.interface'
import {SignerService} from '@services/signer/signer.service'
import {ContractService} from '@services/contract/contract.service'
import {environment} from '../../../../dapp/src/environments/environment'
import {BehaviorSubject, combineLatest} from 'rxjs'
import {publishReplay, refCount, tap} from 'rxjs/operators'
import {ContractDataModel, ContractGrantAppModel, ContractGrantRawModel} from '@services/contract/contract.model'
import {PopupService} from '@services/popup/popup.service'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public data: BehaviorSubject<UserDataInterface> = new BehaviorSubject<UserDataInterface>({
    userRole: RoleEnum.unauthorized,
    userAddress: '',
    DAOMemberAddress: [],
    WorkGroupAddress: [],
    masterAddress: '',
    roles: {
      isMaster: false,
      isDAO: false,
      isWG: false,
      isAuth: false
    },
    voted: [],
    apply: []
  })

  lastAddress = ''
  contract: ContractDataModel | undefined;

  private readonly data$ = combineLatest([this.signerService.user, this.contractService.stream])
    .pipe(
      tap(([userAddress, contract]) => {
        const masterAddress = environment.apis.contractAddress
        // console.log('------', contract)
        const WorkGroupAddress = Object.keys(contract.working.group.member)
        const DAOMemberAddress = Object.keys(contract.dao.member)
        const dr = this.defineRol(masterAddress, userAddress.address, DAOMemberAddress, WorkGroupAddress)
        const dv = this.defineVoted(userAddress.address, contract.tasks)
        const ad = this.defineApply(userAddress.address, contract.tasks)
        this.contract = contract
        this.data.next({
          DAOMemberAddress,
          WorkGroupAddress,
          masterAddress,
          userAddress: userAddress.address,
          userRole: dr.mainRole,
          roles: dr.roles,
          voted: dv,
          apply: ad
        })
        if (userAddress.address !== this.lastAddress) {
          this.popupService.add('Login: ' + userAddress.address)
          this.lastAddress = userAddress.address
        }
        console.log('user data: ', this.data.getValue())
      }),
      publishReplay(1),
      refCount()
    ).subscribe()

  constructor(
    private signerService: SignerService, private contractService: ContractService, private popupService: PopupService
  ) {}

  private defineApply(userAddress: string, tasks: ContractGrantRawModel): string[] {
    let result: string[] = []
    for (const key of Object.keys(tasks)) {
      // @ts-ignore
      if (userAddress && tasks[key]?.applicants?.value.includes(userAddress)) {
        result.push(key)
      }
    }
    return result
  }

  private defineVoted(userAddress: string, tasks: ContractGrantRawModel): string[] {
    const result = []
    // @ts-ignore
    for (const key of Object.keys(tasks)) {
      // for (const key in tasks) {
      // @ts-ignore
      const grant = tasks[key]
      if (grant.voted && Object.keys(grant.voted).includes(userAddress)) {
        result.push(key)
      }
    }
    return result
  }

  private defineRol(masterAddress: string, userAddress: string, DAOMemberAddress: string[], WorkGroupAddress: string[]): RoleRowInterface {
    const result: RoleRowInterface = {
      mainRole: RoleEnum.unauthorized,
      roles: {
        isMaster: false,
        isDAO: false,
        isWG: false,
        isAuth: false
      }
    }
    if (masterAddress === userAddress) {
      result.mainRole = RoleEnum.master
      result.roles.isMaster = true
    }
    if (DAOMemberAddress.includes(userAddress)) {
      result.mainRole = RoleEnum.DAOMember
      result.roles.isDAO = true
    }
    if (WorkGroupAddress.includes(userAddress)) {
      result.mainRole = RoleEnum.workingGroup
      result.roles.isWG = true
    }
    if (userAddress !== '') {
      result.mainRole = result.mainRole === RoleEnum.unauthorized ? RoleEnum.authorized : result.mainRole
      result.roles.isAuth = true
    }
    return result
  }

  public isVoteForTeam(grantId: string, teamId: string): boolean {
    let result = false

    let userAddress = this.data.getValue().userAddress.substr(10, this.data.getValue().userAddress.length)

    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log('isVoteForTeam', grantId, teamId, userAddress)
    // let tasks = this.contract?.tasks
    // if(tasks) {
    //   for (const key of Object.keys(tasks)) {
    //
    //
    //     if(key === grantId){
    //
    //       // @ts-ignore
    //       const grant = tasks[key]
    //       const app = grant.app as any
    //       if(app) {
    //         for (const key2 of Object.keys(app)) {
    //           // console.log('---', app[key2].leader.value)
    //           if(app[key2].leader.value === this.data.getValue().userAddress) {
    //             result = true
    //           }
    //
    //         }
    //       }
    //
    //     }

        // if (grant.voted && Object.keys(grant.voted).includes(userAddress)) {
        //   result.push(key)
        // }
        // let app: ContractGrantAppModel = grant?.app as ContractGrantAppModel
        // if(app) {
        //   console.log(grant?.app.)
        //
        // }

    //   }
    // }
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

    return result
  }
}
