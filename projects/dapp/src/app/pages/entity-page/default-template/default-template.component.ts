import { Component, Input, OnInit } from '@angular/core'
import { ContractGrantModel } from '@services/contract/contract.model'
import { GrantsVariationType } from '@services/static/static.model'
import {DisruptiveContractService} from "@services/contract/disruptive-contract.service";

@Component({
  selector: 'app-default-template',
  templateUrl: './default-template.component.html',
  styleUrls: ['./default-template.component.scss']
})
export class DefaultTemplateComponent {

  @Input() public readonly grant: ContractGrantModel = {}
  @Input() public readonly contract!: GrantsVariationType

  constructor (public disruptiveContractService: DisruptiveContractService) {}

  vote (value: 'like' | 'dislike') {
    const id = this.grant.id || ''
    this.disruptiveContractService.voteForTaskProposal(id, value)
  }
}
