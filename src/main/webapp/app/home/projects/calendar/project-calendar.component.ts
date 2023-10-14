import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { CalendarEvent, CalendarView } from 'angular-calendar';

import dayjs from 'dayjs/esm';

import { map } from 'rxjs/operators';

import { Event, GetProjectEvents200Response, ProjectEventsService } from 'app/api';

import { IProject } from 'app/entities/project/project.model';

import { isDateInProjectRange } from './calendar-utils';
import eventToCalendarEvent, { CalendarMetaModel } from './event-to-calendar-event';

const activeViewQueryParamName = 'activeView';

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

  protected startOfProject: dayjs.Dayjs | undefined;
  protected endOfProject: dayjs.Dayjs | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectEventsService: ProjectEventsService,
    private router: Router,
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

    this.activatedRoute.queryParamMap
      .pipe(
        map(queryParams => queryParams.get(activeViewQueryParamName)),
        map(calendarViewQueryParam => calendarViewQueryParam ?? CalendarView.Month),
        map(calendarViewQueryParam =>
          Object.values(CalendarView).includes(calendarViewQueryParam as CalendarView) ? calendarViewQueryParam : CalendarView.Month,
        ),
        map(calendarViewQueryParam => calendarViewQueryParam as CalendarView),
      )
      .subscribe(calendarView => (this.activeCalendarView = calendarView));

    this.load();
  }

  protected setView(calendarView: CalendarView): void {
    this.router
      .navigate([], {
        queryParams: { [activeViewQueryParamName]: calendarView },
      })
      .catch(() => (this.activeCalendarView = CalendarView.Month));
  }

  private load(): void {
    if (!this.project) {
      return;
    }

    this.viewDate = isDateInProjectRange(this.viewDate, this.startOfProject!, this.endOfProject!) ? this.viewDate : this.project.startDate!;

    this.projectEventsService.getProjectEvents(this.project.id, 0, -1, ['startDateTime,asc'], 'response').subscribe({
      next: (res: HttpResponse<GetProjectEvents200Response>) => {
        this.onResponseSuccess(res);
        this.applyEventFilter();
      },
    });
  }

  private onResponseSuccess(response: HttpResponse<GetProjectEvents200Response>): void {
    this.events = this.fillComponentAttributesFromResponseBody(response.body?.contents);
  }

  private applyEventFilter(): void {
    // TODO: For now...
    this.filteredEvents = this.events;
  }

  private fillComponentAttributesFromResponseBody(data: Array<Event> | undefined): CalendarEvent<CalendarMetaModel>[] {
    return data?.map(eventToCalendarEvent) ?? [];
  }
}
