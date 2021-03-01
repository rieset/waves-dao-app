import { Component, OnInit } from '@angular/core'
import { IconService } from '@services/icon-service/icon-service.service'
import { Router, NavigationEnd } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor (private readonly iconService: IconService, private router: Router) { // eslint-disable-line
  }

  ngOnInit (): void {

    this.iconService.registerIcons()

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return
      }
      window.scrollTo(0, 0)
    })
  }
}
