import { NgModule } from '@angular/core';

import { EventPlannerSharedLibsModule } from 'app/shared/shared-libs.module';

import { ClientsideFilterComponent } from 'app/shared/components/clientside-filter/clientside-filter.component';

@NgModule({
  declarations: [ClientsideFilterComponent],
  imports: [EventPlannerSharedLibsModule],
  exports: [ClientsideFilterComponent],
})
export class ComponentsModule {}
