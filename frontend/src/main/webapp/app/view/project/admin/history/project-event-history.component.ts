import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { EventManager } from 'app/core/util/event-manager.service';

import { EventHistoryService } from 'app/entities/event-history/event-history.service';

import { EventHistory } from 'app/entities/event-history/event-history.model';
import { Project } from 'app/entities/project/project.model';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';

import * as dayjs from 'dayjs';

@Component({
  selector: 'app-project-events-history',
  templateUrl: './project-event-history.component.html',
  styleUrls: ['./project-event-history.component.scss'],
})
export class ProjectEventHistoryComponent implements OnInit, OnDestroy {
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

  showSinceFormControl = new FormControl(null, [Validators.required]);
  showSinceLabel = 'Show since';

  private destroy$ = new Subject();

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
        tap(([data, queryParamMap]) => {
          const page = queryParamMap.get('page');
          this.page = page !== null ? +page : 1;
          const sort = (queryParamMap.get('sort') ?? data['defaultSort']).split(',');
          this.predicate = sort[0];
          this.ascending = sort[1] === 'asc';
          this.project = data.project;
        }),
        map(([, queryParamMap]) => queryParamMap.get('showSince')),
        map((showSince, index) => {
          if (index === 0 && showSince) {
            this.showSinceFormControl.setValue(showSince);
          }

          return showSince;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(showSince => {
        if (showSince) {
          this.loadSince(dayjs(showSince));
        } else {
          this.loadAll();
        }
      });

    this.translateService.get('eventPlannerApp.project.admin.eventHistory.filter.showSince').subscribe(result => {
      if (typeof result === 'string') {
        this.showSinceLabel = result;
      }
    });

    this.showSinceFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((showSince: Date) => {
      this.router.navigate(['.'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          showSince: dayjs(showSince).toJSON(),
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  transition(): void {
    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
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
    this.isLoading = true;
    this.eventHistoryService
      .query(this.project!, {
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<EventHistory[]>) => this.onLoadComplete(res),
        () => this.onLoadError()
      );
  }

  private loadSince(showSince: dayjs.Dayjs): void {
    this.isLoading = true;
    this.eventHistoryService
      .query(this.project!, {
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        showSince: showSince.toJSON(),
      })
      .subscribe(
        (res: HttpResponse<EventHistory[]>) => this.onLoadComplete(res),
        () => this.onLoadError()
      );
  }

  private onLoadComplete(res: HttpResponse<EventHistory[]>): void {
    this.isLoading = false;
    this.onSuccess(res.body, res.headers);
  }

  private onLoadError(): void {
    this.isLoading = false;
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
