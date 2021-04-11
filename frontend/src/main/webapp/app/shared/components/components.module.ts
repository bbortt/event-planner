import { NgModule } from '@angular/core';

import { SharedLibsModule } from 'app/shared/shared-libs.module';

import { ClientsideFilterComponent } from 'app/shared/components/clientside-filter/clientside-filter.component';

@NgModule({
  declarations: [ClientsideFilterComponent],
  imports: [SharedLibsModule],
  exports: [ClientsideFilterComponent],
})
export class ComponentsModule {}
