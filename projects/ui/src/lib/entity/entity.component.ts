import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { ContractGrantModel } from '@services/contract/contract.model'
import { UserService } from '@services/user/user.service'
import { RoleEnum } from '@services/user/user.interface'
import { GrantStatusEnum } from '../../../../services/src/interface'
import { ModalComponent } from '@ui/modal/modal.component'
import { SignerService } from '@services/signer/signer.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { translate } from '@ngneat/transloco'
import { ContractService } from '@services/contract/contract.service'
import { ActivatedRoute } from '@angular/router'
import { tap } from 'rxjs/operators'
import { environment } from '../../../../dapp/src/environments/environment'
import {LinkContentService} from "@services/link-content/link-content.service";

@Component({
  selector: 'ui-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit{
  @Input() public readonly grant: ContractGrantModel = {}
  grantStatusEnum = GrantStatusEnum
  userRoleEnum = RoleEnum
  isDAOVote = false
  @ViewChild(ModalComponent) modal?: ModalComponent
  environment: {
    showDevTools: boolean;
  } = environment;

  reportLink = '';

  constructor (
    private route: ActivatedRoute,
    public userService: UserService,
    private signerService: SignerService,
    private snackBar: MatSnackBar,
    public contractService: ContractService,
    public linkContentService: LinkContentService
  ) {
  }

  ngOnInit(): void {


      if (this.grant?.link?.value) {
        this.linkContentService.init(this.grant.link.value)
      }
    }

  vote (value: 'like' | 'dislike') {
    const id = this.grant.id || ''
    this.contractService.voteForTaskProposal(id, value)
  }

  public signup (): void {
    this.signerService.login().subscribe(() => {
    }, (error) => {
      this.snackBar.open(error, translate('messages.ok'))
    })
  }

  finishVote () {
    this.contractService.finishTaskProposalVoting(this.grant.id as string)
  }

  finishApplicantsVote () {
    this.contractService.finishApplicantsVoting(this.grant.id as string)
  }

  voteTeam (voteValue: 'like' | 'dislike', teamIdentifier: string) {
    this.contractService.voteForApplicant(
      this.grant.id as string,
      teamIdentifier,
      voteValue
    )
  }

  startWork () {
    this.contractService.startWork(this.grant.id as string)
  }

  acceptWorkResult () {
    console.log('-----!!!------acceptWorkResult:', this.grant.id as string, this.userService.data.getValue().userAddress, this.reportLink)
    this.contractService.acceptWorkResult(this.grant.id as string, this.reportLink)
  }

  reject () {
    console.log('-----!!!------reject:')
    this.contractService.rejectTask(this.grant.id as string)
  }
}
