import {NgModule} from '@angular/core'
import { AddMemberModule } from './add-member/add-member.module'
import {AcceptWorkResultModule} from '@ui/modals/accept-work-result/accept-work-result.module'
import {AddRewardModule} from '@ui/modals/add-reward/add-reward.module'
import {AddTaskDetailsModule} from '@ui/modals/add-task-details/add-task-details.module'
import {ApplyModule} from '@ui/modals/apply/apply.module'
import {ProposeGrantModule} from '@ui/modals/propose-grant/propose-grant.module'
import {SubmitSolutionModule} from '@ui/modals/submit-solution/submit-solution.module'

export * from './accept-work-result/accept-work-result.module'
export * from './add-reward/add-reward.module'
export * from './add-task-details/add-task-details.module'
export * from './apply/apply.module'
export * from './propose-grant/propose-grant.module'
export * from './submit-solution/submit-solution.module'

@NgModule({
  imports: [
    AddMemberModule,
    AcceptWorkResultModule,
    AddRewardModule,
    AddTaskDetailsModule,
    ApplyModule,
    ProposeGrantModule,
    SubmitSolutionModule
  ]
})
export class ModalsModule { }