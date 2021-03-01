import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FinishApplicantsVotingComponent } from './finish-applicants-voting.component'

describe('FinishApplicantsVotingComponent', () => {
  let component: FinishApplicantsVotingComponent
  let fixture: ComponentFixture<FinishApplicantsVotingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishApplicantsVotingComponent ]
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishApplicantsVotingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
