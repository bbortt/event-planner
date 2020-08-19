import { NgModule } from '@angular/core';
import { UserByEmailOrLoginComponent } from './user-by-email-or-login/user-by-email-or-login.component';
import { EventPlannerSharedLibsModule } from 'app/shared/shared-libs.module';

@NgModule({
  declarations: [UserByEmailOrLoginComponent],
  imports: [EventPlannerSharedLibsModule],
  exports: [UserByEmailOrLoginComponent],
})
export class ComponentsModule {}
