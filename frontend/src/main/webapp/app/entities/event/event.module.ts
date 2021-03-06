import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';

import { DxAutocompleteModule, DxDateBoxModule } from 'devextreme-angular';

import { EventUpdateComponent } from 'app/entities/event/event-update.component';
import { EventUpdateModalComponent } from 'app/entities/event/event-update-modal.component';

@NgModule({
  imports: [SharedModule, DxAutocompleteModule, DxDateBoxModule],
  declarations: [EventUpdateComponent, EventUpdateModalComponent],
})
export class EventPlannerEventModule {}
