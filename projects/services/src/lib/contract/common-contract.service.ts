import { Injectable } from '@angular/core'
import { ContractService } from '@services/contract/contract.service'
import { SignerService } from '@services/signer/signer.service'
import { catchError, tap } from 'rxjs/operators'
import { EMPTY } from 'rxjs'
import { translate } from '@ngneat/transloco'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class CommonContractService {
  // ToDo change to waitTx function or else
  private readonly averageOperationSpeed = 10000

  constructor (
      private contractService: ContractService,
      private readonly signerService: SignerService,
      private snackBar: MatSnackBar,
      public router: Router
  ) {}

  public addDAOMember (members: string) {
    return this.signerService.invokeProcess(
      this.contractService.getAddress(),
      'addDAOMember',
      [
        { type: 'string', value: members }
      ]
    ).pipe(
      catchError((error) => {
        this.snackBar.open(error.message, translate('messages.ok'))
        return EMPTY
      }),
      tap(() => {
        this.contractService.refresh()
        this.snackBar.open('Transaction is complete', translate('messages.ok'))
      })
    )
  }

  public addGroupMember (members: string) {
    return this.signerService.invokeProcess(
      this.contractService.getAddress(),
      'addGroupMember',
      [
        { type: 'string', value: members }
      ]
    )
      .pipe(
        catchError((error) => {
          this.snackBar.open(error.message, translate('messages.ok'))
          return EMPTY
        }),
        tap(() => {
          this.contractService.refresh()
          this.snackBar.open('Transaction is complete', translate('messages.ok'))
        })
      )
  }

  public addTask (taskName: string, link: string) {
    console.log('---ADD TASK')
    // return this.signerService.invokeProcess(
    //   this.contractService.getAddress(),
    //   'addTask',
    //   [
    //     { type: 'string', value: taskName },
    //     { type: 'string', value: link }
    //   ]
    // )
    //   .pipe(
    //     catchError((error) => {
    //       this.snackBar.open(error.message, translate('messages.ok'))
    //       return EMPTY
    //     }),
    //     tap((e) => {
    //       this.contractService.refresh()
    //       this.snackBar.open('Transaction is complete', translate('messages.ok'))
    //     })
    //   )
  }

  public addReward (taskId: string, reward: string) {
    console.log('addReward', taskId, reward)
    return this.signerService.invokeProcess(
      this.contractService.getAddress(),
      'addReward',
      [
        { type: 'string', value: taskId }
      ],
      [
        { assetId: 'WAVES', amount: reward }
      ]
    )
      .pipe(
        catchError((error) => {
          this.snackBar.open(error.message, translate('messages.ok'))
          return EMPTY
        }),
        tap(() => {
          this.contractService.refresh()
          this.snackBar.open('Transaction is complete', translate('messages.ok'))
        })
      )
  }
}
