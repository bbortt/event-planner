import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { CalendarEvent, CalendarMonthViewDay, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';

import dayjs from 'dayjs/esm';

import { Event, GetProjectEvents200Response, ProjectEventsService } from 'app/api';

import { IProject } from 'app/entities/project/project.model';
import eventToCalendarEvent, { CalendarMetaModel } from './event-to-calendar-event';

@Component({
  templateUrl: './project-calendar.component.html',
  styleUrls: ['./project-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectCalendarComponent implements OnInit {
  @Input() project: IProject | null = null;

  protected activeCalendarView: CalendarView = CalendarView.Month;
  protected currentLang: string;

  protected viewDate: dayjs.Dayjs = dayjs();
  protected events: CalendarEvent<CalendarMetaModel>[] = [];

  protected readonly calendarView = CalendarView;
  protected readonly monday = DAYS_OF_WEEK.MONDAY;

  private startOfProject: dayjs.Dayjs | undefined;
  private endOfProject: dayjs.Dayjs | undefined;

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

  protected beforeMonthViewRender({ body }: { body: CalendarMonthViewDay<CalendarMetaModel>[] }): void {
    body.forEach(day => {
      if (!this.isDateInProjectRange(dayjs(day.date))) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  protected setView(calendarView: CalendarView): void {
    this.activeCalendarView = calendarView;
  }

  private load(): void {
    if (!this.project) {
      return;
    }

    this.viewDate = this.isDateInProjectRange(this.viewDate) ? this.viewDate : this.project.startDate!;

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

  private isDateInProjectRange(date: dayjs.Dayjs): boolean {
    if (!this.project) {
      return false;
    }

    return (
      (date.isSame(this.startOfProject) || date.isAfter(this.startOfProject)) &&
      (date.isSame(this.endOfProject) || date.isBefore(this.endOfProject))
    );
  }
}
