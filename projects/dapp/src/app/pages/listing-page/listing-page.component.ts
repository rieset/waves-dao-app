import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core'
import {
  CONTRACT,
  LISTING_PAGE_PROVIDERS
} from './listing-page.providers'
import { LoadingWrapperModel } from '@libs/loading-wrapper/loading-wrapper'
import { GrantsVariationType } from '@services/contract/contract.model'
import { UserService } from '@services/user/user.service'
import { APP_CONSTANTS, AppConstantsInterface } from '@constants'

@Component({
  selector: 'app-listing-page',
  templateUrl: './listing-page.component.html',
  styleUrls: ['./listing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: LISTING_PAGE_PROVIDERS
})
export class ListingPageComponent implements OnInit, OnDestroy {
  constructor (
      @Inject(CONTRACT) public contract: LoadingWrapperModel<GrantsVariationType>,
      @Inject(APP_CONSTANTS) public readonly constants: AppConstantsInterface,
      public readonly userService: UserService
  ) {}

  ngOnInit (): void {

  }

  ngOnDestroy () {
    this.contract.destroy()
  }
}
