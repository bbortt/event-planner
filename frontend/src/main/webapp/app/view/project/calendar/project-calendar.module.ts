import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { DxSchedulerModule } from 'devextreme-angular';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { EventPlannerEventModule } from 'app/entities/event/event.module';

import { ProjectCalendarComponent } from 'app/view/project/calendar/project-calendar.component';
import { ProjectCalendarFilterComponent } from 'app/view/project/calendar/filter/project-calendar-filter.component';

import { PROJECT_CALENDAR_ROUTES } from './project-calendar.routes';

@NgModule({
  imports: [
    SharedModule,
    DxSchedulerModule,
    NgMultiSelectDropDownModule.forRoot(),
    EventPlannerEventModule,
    RouterModule.forChild(PROJECT_CALENDAR_ROUTES),
  ],
  declarations: [ProjectCalendarComponent, ProjectCalendarFilterComponent],
  entryComponents: [ProjectCalendarComponent],
})
export class EventPlannerProjectCalendarModule {}
