import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { DxSchedulerModule } from 'devextreme-angular';

import { EventPlannerEventModule } from 'app/entities/event/event.module';

import { ProjectCalendarComponent } from 'app/view/project/calendar/project-calendar.component';

import { PROJECT_CALENDAR_ROUTES } from './project-calendar.routes';

@NgModule({
  imports: [SharedModule, DxSchedulerModule, EventPlannerEventModule, RouterModule.forChild(PROJECT_CALENDAR_ROUTES)],
  declarations: [ProjectCalendarComponent],
  entryComponents: [ProjectCalendarComponent],
})
export class EventPlannerProjectCalendarModule {}
