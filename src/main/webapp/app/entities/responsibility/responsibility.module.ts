import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from 'app/shared/shared.module';
import { ResponsibilityComponent } from './responsibility.component';
import { ResponsibilityDetailComponent } from './responsibility-detail.component';
import { ResponsibilityUpdateComponent } from './responsibility-update.component';
import { ResponsibilityDeleteDialogComponent } from './responsibility-delete-dialog.component';
import { responsibilityRoute } from './responsibility.route';

@NgModule({
  imports: [EventPlannerSharedModule, RouterModule.forChild(responsibilityRoute)],
  declarations: [
    ResponsibilityComponent,
    ResponsibilityDetailComponent,
    ResponsibilityUpdateComponent,
    ResponsibilityDeleteDialogComponent,
  ],
  entryComponents: [ResponsibilityDeleteDialogComponent],
})
export class EventPlannerResponsibilityModule {}
