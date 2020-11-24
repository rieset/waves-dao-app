import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EntityComponent } from './entity.component'
import { TranslocoModule } from '@ngneat/transloco'
import { RouterModule } from '@angular/router'
import { ModalModule } from '@ui/modal/modal.module'
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [EntityComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    RouterModule,
    ModalModule,
    FormsModule
  ],
  exports: [EntityComponent]
})
export class EntityModule { }
