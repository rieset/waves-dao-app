import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core'
import {
  CONTRACT,
  LISTING_PAGE_PROVIDERS
} from './listing-page.providers'
import { LoadingWrapperModel } from '@libs/loading-wrapper/loading-wrapper'
import { UserService } from '@services/user/user.service'
import {
  API,
  APP_CONSTANTS,
  AppApiInterface,
  AppConstantsInterface
} from '@constants'
import { GrantsVariationType } from '@services/static/static.model'

@Component({
  selector: 'app-listing-page',
  templateUrl: './listing-page.component.html',
  styleUrls: ['./listing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: LISTING_PAGE_PROVIDERS
})
export class ListingPageComponent implements OnInit, OnDestroy {
  constructor (
    @Inject(CONTRACT) public contract: LoadingWrapperModel<GrantsVariationType>, // eslint-disable-line
    @Inject(APP_CONSTANTS) public readonly constants: AppConstantsInterface, // eslint-disable-line
    @Inject(API) public readonly api: AppApiInterface, // eslint-disable-line
    public readonly userService: UserService // eslint-disable-line
  ) {}

  ngOnInit (): void {
    console.log('CONSTANTS', this.constants)
    console.log('API', this.api)
  }

  ngOnDestroy (): void {
    this.contract.destroy()
  }
}
