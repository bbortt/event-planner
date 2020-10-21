import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from 'app/shared/shared.module';
import { LocationTimeSlotComponent } from './location-time-slot.component';
import { LocationTimeSlotDetailComponent } from './location-time-slot-detail.component';
import { LocationTimeSlotUpdateComponent } from './location-time-slot-update.component';
import { LocationTimeSlotDeleteDialogComponent } from './location-time-slot-delete-dialog.component';
import { locationTimeSlotRoute } from './location-time-slot.route';

@NgModule({
  imports: [EventPlannerSharedModule, RouterModule.forChild(locationTimeSlotRoute)],
  declarations: [
    LocationTimeSlotComponent,
    LocationTimeSlotDetailComponent,
    LocationTimeSlotUpdateComponent,
    LocationTimeSlotDeleteDialogComponent,
  ],
  entryComponents: [LocationTimeSlotDeleteDialogComponent],
})
export class EventPlannerLocationTimeSlotModule {}
