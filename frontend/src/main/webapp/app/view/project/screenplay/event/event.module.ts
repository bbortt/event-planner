import { NgModule } from '@angular/core';

import { EventPlannerSharedModule } from 'app/shared/shared.module';

import { DxAutocompleteModule, DxDateBoxModule } from 'devextreme-angular';

import { EventUpdateComponent } from 'app/view/project/screenplay/event/event-update.component';
import { EventUpdateModalComponent } from 'app/view/project/screenplay/event/event-update-modal.component';

@NgModule({
  imports: [EventPlannerSharedModule, DxAutocompleteModule, DxDateBoxModule],
  declarations: [EventUpdateComponent, EventUpdateModalComponent],
})
export class EventPlannerEventModule {}
