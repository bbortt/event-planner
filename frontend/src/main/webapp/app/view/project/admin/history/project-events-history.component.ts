import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { combineLatest, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { EventManager } from 'app/core/util/event-manager.service';

import { EventHistoryService } from 'app/entities/event-history/event-history.service';

import { EventHistory } from 'app/entities/event-history/event-history.model';
import { Project } from 'app/entities/project/project.model';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';

import * as dayjs from 'dayjs';

@Component({
  selector: 'app-project-events-history',
  templateUrl: './project-events-history.component.html',
  styleUrls: ['./project-events-history.component.scss'],
})
export class ProjectEventsHistoryComponent implements OnInit, OnDestroy {
  project?: Project;
  eventHistory: EventHistory[] = [];

  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;

  now = dayjs();
  dateTimeFormat = DATE_TIME_FORMAT;

  eventsSince = new FormControl(null, [Validators.required]);
  eventsSinceLabel = 'Show since';

  private eventSubscriber?: Subscription;

  constructor(
    private eventHistoryService: EventHistoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: EventManager,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap])
      .pipe(
        tap(([data, params]) => {
          const page = params.get('page');
          this.page = page !== null ? +page : 1;
          const sort = (params.get('sort') ?? data['defaultSort']).split(',');
          this.predicate = sort[0];
          this.ascending = sort[1] === 'asc';
        }),
        map(([{ project }]) => project as Project)
      )
      .subscribe((project: Project) => {
        this.project = project;

        // eslint-disable-next-line no-console
        console.log('project: ', this.project);

        this.loadAll();
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

  transition(): void {
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
      },
    });
  }

  trackIdentity(index: number, item: EventHistory): number {
    return item.id!;
  }

  loadAll(): void {
    // eslint-disable-next-line no-console
    console.log('load all: ', this.project);

    this.isLoading = true;
    this.eventHistoryService
      .query(this.project!, {
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<EventHistory[]>) => {
          // eslint-disable-next-line no-console
          console.log('response');

          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        () => (this.isLoading = false)
      );
  }

  private sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  private onSuccess(eventHistory: EventHistory[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.eventHistory = eventHistory ?? [];
  }
}
