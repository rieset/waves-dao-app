import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DefaultTemplateComponent } from './default-template.component'
import { MatDialogModule } from '@angular/material/dialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { provideApi, provideAppConstants } from '@constants'
import { ContractProviderDefine } from '@services/contract/contract-provider-factory'
import { CONTRACT } from '@pages/about-page/about-page.provider'
import { getTranslocoModule } from '@dapp/src/app/transloco-module.spec'
import { RouterTestingModule } from '@angular/router/testing'
import { MatSnackBarModule } from '@angular/material/snack-bar'

describe('DefaultTemplateComponent', () => {
  let component: DefaultTemplateComponent
  let fixture: ComponentFixture<DefaultTemplateComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        getTranslocoModule(),
        RouterTestingModule,
        MatSnackBarModule
      ],
      providers: [
        provideAppConstants(),
        provideApi()
      ],
      declarations: [DefaultTemplateComponent]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultTemplateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
