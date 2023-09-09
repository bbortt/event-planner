import { Component, Input, OnInit } from '@angular/core';

import { CalendarEvent } from 'angular-calendar';

import dayjs from 'dayjs/esm';

import { CalendarMetaModel } from './event-to-calendar-event';

@Component({
  selector: 'app-project-calender-day-view',
  templateUrl: './project-calendar-day-view.component.html',
})
export class ProjectCalendarDayViewComponent implements OnInit {
  @Input() events: CalendarEvent<CalendarMetaModel>[] = [];
  @Input() initialViewDate: dayjs.Dayjs | null = null;
  @Input() projectStartDate: dayjs.Dayjs | null = null;
  @Input() projectEndDate: dayjs.Dayjs | null = null;

  protected viewDate: dayjs.Dayjs = dayjs();

  ngOnInit(): void {
    this.viewDate = this.initialViewDate ?? this.viewDate;
  }
}
