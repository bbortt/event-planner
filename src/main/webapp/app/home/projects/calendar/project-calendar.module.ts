import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import SharedModule from 'app/shared/shared.module';

import { PROJECT_CALENDAR_ROUTES } from './project-calendar.route';

import { ProjectCalendarComponent } from './project-calendar.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(PROJECT_CALENDAR_ROUTES),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [ProjectCalendarComponent],
})
export class ProjectCalendarModule {}
