import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from 'app/shared/shared.module';

import { DxDateBoxModule, DxSchedulerModule, DxSliderModule, DxTemplateModule } from 'devextreme-angular';

import { EventPlannerEventModule } from 'app/view/project/screenplay/event/event.module';

import { ProjectScreenplayComponent } from 'app/view/project/screenplay/project-screenplay.component';
import { ProjectScreenplayFilterComponent } from 'app/view/project/screenplay/filter/project-screenplay-filter.component';
import { ProjectScreenplayLocationComponent } from 'app/view/project/screenplay/project-screenplay-location.component';

import { SchedulerAppointmentComponent } from 'app/view/project/screenplay/devextreme/scheduler-appointment.component';
import { SchedulerResourceComponent } from 'app/view/project/screenplay/devextreme/scheduler-resource.component';

import { PROJECT_SCREENPLAY_ROUTES } from './project-screenplay.routes';

@NgModule({
  imports: [
    EventPlannerSharedModule,
    DxSliderModule,
    DxDateBoxModule,
    DxSchedulerModule,
    DxTemplateModule,
    EventPlannerEventModule,
    RouterModule.forChild(PROJECT_SCREENPLAY_ROUTES),
  ],
  declarations: [
    ProjectScreenplayComponent,
    ProjectScreenplayFilterComponent,
    ProjectScreenplayLocationComponent,
    SchedulerAppointmentComponent,
    SchedulerResourceComponent,
  ],
  entryComponents: [ProjectScreenplayComponent],
})
export class EventPlannerProjectScreenplayModule {}
