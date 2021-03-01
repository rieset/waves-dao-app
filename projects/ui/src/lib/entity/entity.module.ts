import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EntityComponent } from './entity.component'
import { TranslocoModule } from '@ngneat/transloco'
import { RouterModule } from '@angular/router'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HeaderModule } from '@ui/entity/header/header.module'
import { BodyModule } from '@ui/entity/body/body.module'
import { ControlsModule } from '@ui/entity/controls/controls.module'
import { DialogModule } from '@ui/dialog/dialog.module'
import { ApplyModule } from '@ui/modals/apply/apply.module'
import { LinkContentModule } from '@services/link-content/link-content.module'
import { VoteForTaskModule } from '@ui/vote-for-task/vote-for-task.module'
import { StepperModule } from '@ui/stepper/stepper.module'
import { AcceptWorkResultModule } from '@ui/modals/accept-work-result/accept-work-result.module'
import { AddMemberModule } from '@ui/modals/add-member/add-member.module'

@NgModule({
  declarations: [EntityComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    RouterModule,
    FormsModule,
    HeaderModule,
    BodyModule,
    ControlsModule,
    ReactiveFormsModule,
    DialogModule,
    ApplyModule,
    LinkContentModule,
    VoteForTaskModule,
    StepperModule,
    AcceptWorkResultModule,
    AddMemberModule
  ],
  exports: [EntityComponent]
})
export class EntityModule { }
