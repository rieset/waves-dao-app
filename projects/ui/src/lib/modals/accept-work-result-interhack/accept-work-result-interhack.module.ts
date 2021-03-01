import { AcceptWorkResultInterhackComponent } from './accept-work-result-interhack.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { TranslocoModule } from '@ngneat/transloco'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'

@NgModule({
  declarations: [AcceptWorkResultInterhackComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [AcceptWorkResultInterhackComponent]
})
export class AcceptWorkResultInterhackModule { }
