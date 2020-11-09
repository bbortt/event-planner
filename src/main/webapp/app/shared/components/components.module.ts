import { NgModule } from '@angular/core';
import { FrontendSearchComponent } from 'app/shared/components/frontend-search/frontend-search.component';
import { UserByEmailOrLoginComponent } from 'app/shared/components/user-by-email-or-login/user-by-email-or-login.component';
import { EventPlannerSharedLibsModule } from 'app/shared/shared-libs.module';

@NgModule({
  declarations: [FrontendSearchComponent, UserByEmailOrLoginComponent],
  imports: [EventPlannerSharedLibsModule],
  exports: [FrontendSearchComponent, UserByEmailOrLoginComponent],
})
export class ComponentsModule {}
