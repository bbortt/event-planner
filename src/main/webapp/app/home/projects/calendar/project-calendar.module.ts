import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CalendarDateFormatter, CalendarModule, CalendarMomentDateFormatter, DateAdapter, MOMENT } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';

import dayjs from 'dayjs/esm';

import SharedModule from 'app/shared/shared.module';

import { PROJECT_CALENDAR_ROUTES } from './project-calendar.route';

import { ProjectCalendarComponent } from './project-calendar.component';

export const dayjsAdapterFactory = (): DateAdapter => adapterFactory(dayjs);

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(PROJECT_CALENDAR_ROUTES),
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: dayjsAdapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter,
        },
      },
    ),
  ],
  declarations: [ProjectCalendarComponent],
  providers: [
    {
      provide: MOMENT,
      useValue: dayjs,
    },
  ],
})
export class ProjectCalendarModule {}
