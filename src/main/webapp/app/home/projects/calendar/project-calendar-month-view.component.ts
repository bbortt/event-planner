import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { CalendarEvent, CalendarMonthViewDay, DAYS_OF_WEEK } from 'angular-calendar';

import dayjs from 'dayjs/esm';

import { isDateInProjectRange } from './calendar-utils';
import { CalendarMetaModel } from './event-to-calendar-event';

@Component({
  selector: 'app-project-calender-month-view',
  templateUrl: './project-calendar-month-view.component.html',
  styleUrls: ['./project-calendar-month-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectCalendarMonthViewComponent implements OnInit {
  @Input() events: CalendarEvent<CalendarMetaModel>[] = [];
  @Input() initialViewDate: dayjs.Dayjs | null = null;
  @Input() projectStartDate: dayjs.Dayjs | null = null;
  @Input() projectEndDate: dayjs.Dayjs | null = null;

  protected viewDate: dayjs.Dayjs = dayjs();
  protected readonly monday = DAYS_OF_WEEK.MONDAY;

  ngOnInit(): void {
    this.viewDate = this.initialViewDate ?? this.viewDate;
  }

  protected beforeMonthViewRender({ body }: { body: CalendarMonthViewDay<CalendarMetaModel>[] }): void {
    if (!this.projectStartDate || !this.projectEndDate) {
      return;
    }

    body.forEach(day => {
      if (!isDateInProjectRange(dayjs(day.date), this.projectStartDate!, this.projectEndDate!)) {
        day.cssClass = 'cal-disabled';
      }
    });
  }
}
