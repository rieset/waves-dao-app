import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FinishApplicantsVotingComponent } from './finish-applicants-voting.component'
import {ReactiveFormsModule} from '@angular/forms'
import {MatFormFieldModule} from '@angular/material/form-field'
import {TranslocoModule} from '@ngneat/transloco'
import {MatInputModule} from '@angular/material/input'

@NgModule({
  declarations: [FinishApplicantsVotingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [FinishApplicantsVotingComponent]
})
export class FinishApplicantsVotingModule { }
