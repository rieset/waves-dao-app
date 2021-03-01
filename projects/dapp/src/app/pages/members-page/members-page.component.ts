import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject
} from '@angular/core'
import { Location } from '@angular/common'
import { UserService } from '@services/user/user.service'
import { API, APP_CONSTANTS, AppApiInterface, AppConstantsInterface } from '@constants'
import { StaticService } from '@services/static/static.service'
import { DialogComponent } from '@ui/dialog/dialog.component'
import { SubmitCallBackAddMemberArg } from '@ui/dialog/dialog.tokens'
import { MatDialog } from '@angular/material/dialog'
import { AddMemberComponent } from '@ui/modals/add-member/add-member.component'
import { translate } from '@ngneat/transloco'
import { CommonContractService } from '@services/contract/common-contract.service'

@Component({
  selector: 'app-members-page',
  templateUrl: './members-page.component.html',
  styleUrls: ['./members-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersPageComponent {
  public readonly user$ = this.userService.data

  constructor (
    private readonly commonContractService: CommonContractService,  // eslint-disable-line
    private readonly dialog: MatDialog, // eslint-disable-line
    private readonly location: Location, // eslint-disable-line
    public userService: UserService, // eslint-disable-line
    public staticService: StaticService, // eslint-disable-line
    public cdr: ChangeDetectorRef, // eslint-disable-line
    @Inject(API) public readonly api: AppApiInterface, // eslint-disable-line
    @Inject(APP_CONSTANTS) public readonly constants: AppConstantsInterface // eslint-disable-line
  ) {
  }

  goBack (): void {
    this.location.back()
  }

  openAddDAOModal (): void {
    const dialog = this.dialog.open(DialogComponent, {
      width: '500px',
      maxWidth: '100vw',
      data: {
        component: AddMemberComponent,
        params: {

          title: translate('modal.texts.add_member'),
          submitBtnText: translate('modal.btn.apply'),
          submitCallBack: (data: SubmitCallBackAddMemberArg) => {
            this.commonContractService.addDAOMember(data.address)
              .subscribe()
            dialog.close()
          }
        }
      }
    })
  }

  openAddWGModal (): void {
    const dialog = this.dialog.open(DialogComponent, {
      width: '500px',
      maxWidth: '100vw',
      data: {
        component: AddMemberComponent,
        params: {
          title: translate('modal.texts.add_member'),
          submitBtnText: translate('modal.btn.apply'),
          submitCallBack: (data: SubmitCallBackAddMemberArg) => {
            this.commonContractService.addGroupMember(data.address)
              .subscribe()
            dialog.close()
          }
        }
      }
    })
  }
}
