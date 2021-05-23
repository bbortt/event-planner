import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { EventManager } from 'app/core/util/event-manager.service';

import { EventHistoryService } from 'app/entities/event-history/event-history.service';

import { EventHistory } from 'app/entities/event-history/event-history.model';
import { Project } from 'app/entities/project/project.model';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import * as dayjs from 'dayjs';

@Component({
  selector: 'app-project-events-history',
  templateUrl: './project-events-history.component.html',
  styleUrls: ['./project-events-history.component.scss'],
})
export class ProjectEventsHistoryComponent implements OnInit, OnDestroy {
  eventHistory: EventHistory[] = [];

  now = dayjs();
  dateTimeFormat = DATE_TIME_FORMAT;

  eventSubscriber?: Subscription;

  eventsSince = new FormControl(null, [Validators.required]);
  eventsSinceLabel = 'Show since';

  constructor(
    private eventHistoryService: EventHistoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: EventManager,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        map(({ project }) => project as Project),
        switchMap((project: Project) => this.loadHistory(project))
      )
      .subscribe((eventHistory: EventHistory[]) => {
        this.eventHistory = eventHistory;
      });

    this.translateService.get('eventPlannerApp.project.admin.eventHistory.filter.eventsSince').subscribe(result => {
      if (typeof result === 'string') {
        this.eventsSinceLabel = result;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  private loadHistory(project: Project): Observable<EventHistory[]> {
    return this.eventHistoryService.query(project).pipe(map((res: HttpResponse<EventHistory[]>) => res.body ?? []));
  }
}
