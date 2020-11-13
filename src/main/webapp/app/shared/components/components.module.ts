import { NgModule } from '@angular/core';
import { ClientsideFilterComponent } from 'app/shared/components/clientside-filter/clientside-filter.component';
import { UserByEmailOrLoginComponent } from 'app/shared/components/user-by-email-or-login/user-by-email-or-login.component';
import { EventPlannerSharedLibsModule } from 'app/shared/shared-libs.module';

@NgModule({
  declarations: [ClientsideFilterComponent, UserByEmailOrLoginComponent],
  imports: [EventPlannerSharedLibsModule],
  exports: [ClientsideFilterComponent, UserByEmailOrLoginComponent],
})
export class ComponentsModule {}
