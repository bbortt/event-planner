import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { CalendarEvent, DAYS_OF_WEEK } from 'angular-calendar';

import { WeekDay } from 'calendar-utils';

import dayjs from 'dayjs/esm';

import { CalendarMetaModel } from './event-to-calendar-event';
import { isDateInProjectRange } from './calendar-utils';

@Component({
  selector: 'app-project-calender-week-view',
  templateUrl: './project-calendar-week-view.component.html',
  styleUrls: ['./project-calendar-week-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectCalendarWeekViewComponent implements OnInit {
  @Input() events: CalendarEvent<CalendarMetaModel>[] = [];
  @Input() initialViewDate: dayjs.Dayjs | null = null;
  @Input() projectStartDate: dayjs.Dayjs | null = null;
  @Input() projectEndDate: dayjs.Dayjs | null = null;

  protected viewDate: dayjs.Dayjs = dayjs();
  protected readonly monday = DAYS_OF_WEEK.MONDAY;

  ngOnInit(): void {
    this.viewDate = this.initialViewDate ?? this.viewDate;
  }

  protected beforeWeekViewRender({ header }: { header: WeekDay[] }): void {
    if (!this.projectStartDate || !this.projectEndDate) {
      return;
    }

    header.forEach(day => {
      if (!isDateInProjectRange(dayjs(day.date), this.projectStartDate!, this.projectEndDate!)) {
        day.cssClass = 'cal-disabled';
      }
    });
  }
}
