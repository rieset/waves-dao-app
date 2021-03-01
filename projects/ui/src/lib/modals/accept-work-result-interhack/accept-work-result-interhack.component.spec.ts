import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AcceptWorkResultComponent } from './accept-work-result.component'
import { getTranslocoModule } from '@dapp/src/app/transloco-module.spec'
import { ReactiveFormsModule } from '@angular/forms'
import { provideApi, provideAppConstants } from '@constants'
import { DIALOG_DATA } from '@ui/dialog/dialog.tokens'

describe('AcceptWorkResultComponent', () => {
  let component: AcceptWorkResultComponent
  let fixture: ComponentFixture<AcceptWorkResultComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule(), ReactiveFormsModule],
      providers: [
        provideAppConstants(),
        provideApi(),
        {
          provide: DIALOG_DATA,
          useValue: {}
        }
      ],
      declarations: [AcceptWorkResultComponent]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptWorkResultComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
