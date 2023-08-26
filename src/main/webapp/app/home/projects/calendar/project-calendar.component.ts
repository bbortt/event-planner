import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { CalendarEvent, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';

import { Event, GetProjectEvents200Response, ProjectEventsService } from 'app/api';

import { IProject } from 'app/entities/project/project.model';

import eventToCalendarEvent, { CalendarMetaModel } from './event-to-calendar-event';

@Component({
  templateUrl: './project-calendar.component.html',
})
export class ProjectCalendarComponent implements OnInit {
  @Input() project: IProject | null = null;

  protected activeCalendarView: CalendarView = CalendarView.Month;
  protected currentLang: string;

  protected viewDate: Date = new Date();
  protected events: CalendarEvent<CalendarMetaModel>[] = [];

  protected readonly CalendarView = CalendarView;
  protected readonly monday = DAYS_OF_WEEK.MONDAY;

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
    this.load();
  }

  load(): void {
    if (!this.project) {
      return;
    }

    this.projectEventsService.getProjectEvents(this.project.id, 0, -1, ['startDateTime,asc'], 'response').subscribe({
      next: (res: HttpResponse<GetProjectEvents200Response>) => {
        this.onResponseSuccess(res);
      },
    });
  }

  protected setView(calendarView: CalendarView): void {
    this.activeCalendarView = calendarView;
  }

  private onResponseSuccess(response: HttpResponse<GetProjectEvents200Response>): void {
    this.events = this.fillComponentAttributesFromResponseBody(response.body?.contents);
  }

  private fillComponentAttributesFromResponseBody(data: Array<Event> | undefined): CalendarEvent<CalendarMetaModel>[] {
    return data?.map(eventToCalendarEvent) ?? [];
  }
}
