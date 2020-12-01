import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { DevGridModule } from '@ui/dev-grid/dev-grid.module'
import { AppComponent } from './app.component'
import { NgProgressModule } from 'ngx-progressbar'
import { MarkdownModule } from 'ngx-markdown'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DevGridModule,
        NgProgressModule,
        MarkdownModule
      ],
      declarations: [
        AppComponent
      ]
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })
})
