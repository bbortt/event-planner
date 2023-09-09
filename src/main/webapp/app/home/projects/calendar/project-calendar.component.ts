import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { CalendarEvent, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';

import dayjs from 'dayjs/esm';

import { Event, GetProjectEvents200Response, ProjectEventsService } from 'app/api';

import { IProject } from 'app/entities/project/project.model';

import { isDateInProjectRange } from './calendar-utils';
import eventToCalendarEvent, { CalendarMetaModel } from './event-to-calendar-event';

@Component({
  selector: 'app-project-calender',
  templateUrl: './project-calendar.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProjectCalendarComponent implements OnInit {
  @Input() project: IProject | null = null;

  protected activeCalendarView: CalendarView = CalendarView.Month;
  protected currentLang: string;

  protected viewDate: dayjs.Dayjs = dayjs();
  protected events: CalendarEvent<CalendarMetaModel>[] = [];
  protected filteredEvents: CalendarEvent<CalendarMetaModel>[] = [];

  protected readonly calendarView = CalendarView;
  protected readonly monday = DAYS_OF_WEEK.MONDAY;

  protected startOfProject: dayjs.Dayjs | undefined;
  protected endOfProject: dayjs.Dayjs | undefined;

  constructor(
    private projectEventsService: ProjectEventsService,
    private translateService: TranslateService,
  ) {
    this.currentLang = translateService.currentLang;

    translateService.onLangChange.subscribe(({ lang }) => {
      this.currentLang = lang;
    });
  }

  ngOnInit(): void {
    this.startOfProject = this.project?.startDate?.utc(true).startOf('day');
    this.endOfProject = this.project?.endDate?.utc(true).endOf('day');

    this.load();
  }

  protected setView(calendarView: CalendarView): void {
    this.activeCalendarView = calendarView;
  }

  private load(): void {
    if (!this.project) {
      return;
    }

    this.viewDate = isDateInProjectRange(this.viewDate, this.startOfProject!, this.endOfProject!) ? this.viewDate : this.project.startDate!;

    this.projectEventsService.getProjectEvents(this.project.id, 0, -1, ['startDateTime,asc'], 'response').subscribe({
      next: (res: HttpResponse<GetProjectEvents200Response>) => {
        this.onResponseSuccess(res);
      },
    });
  }

  private onResponseSuccess(response: HttpResponse<GetProjectEvents200Response>): void {
    this.events = this.fillComponentAttributesFromResponseBody(response.body?.contents);
  }

  private fillComponentAttributesFromResponseBody(data: Array<Event> | undefined): CalendarEvent<CalendarMetaModel>[] {
    return data?.map(eventToCalendarEvent) ?? [];
  }
}
