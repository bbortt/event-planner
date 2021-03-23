import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Project } from 'app/entities/project/project.model';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { DEFAULT_SCHEDULER_CELL_DURATION } from 'app/app.constants';
import { DATE_FORMAT } from 'app/config/input.constants';

import * as moment from 'moment';

export const ROUTE_CELL_DURATION_PARAMETER_NAME = 'duration';
export const ROUTE_FROM_PARAMETER_NAME = 'showFrom';
export const ROUTE_TO_PARAMETER_NAME = 'showTo';
export const ROUTE_INTERVAL_PARAMETER_NAME = 'interval';

@Component({
  selector: 'app-project-screenplay-filter',
  templateUrl: './project-screenplay-filter.component.html',
  styleUrls: ['./project-screenplay-filter.component.scss'],
})
export class ProjectScreenplayFilterComponent implements OnInit, OnDestroy {
  @Input()
  project?: Project;

  @Input()
  allExpanded?: EventEmitter<boolean>;

  @Output()
  expandAll = new EventEmitter<boolean>();

  chevronDown = faChevronDown;
  chevronUp = faChevronUp;

  locationsExpanded = false;

  cellDuration = DEFAULT_SCHEDULER_CELL_DURATION;
  from: string | number | Date = new Date();
  minToDate: string | number | Date = new Date();
  to: string | number | Date = new Date();
  interval = 1;

  dateFormat = DATE_FORMAT;

  private destroy$ = new Subject<void>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.allExpanded!.pipe(takeUntil(this.destroy$)).subscribe((allExpanded: boolean) => (this.locationsExpanded = allExpanded));

    this.activatedRoute.queryParams.pipe(take(1)).subscribe((params: Params) => {
      const cellDuration = params[ROUTE_CELL_DURATION_PARAMETER_NAME];
      const from = params[ROUTE_FROM_PARAMETER_NAME];
      const to = params[ROUTE_TO_PARAMETER_NAME];

      this.cellDuration = cellDuration || DEFAULT_SCHEDULER_CELL_DURATION;
      this.from = (from ? moment(from) : this.project!.startTime).toDate();
      this.minToDate = this.from;
      this.to = (to ? moment(to) : this.project!.endTime).toDate();

      this.recalculateInterval();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  expandLocations(): void {
    this.locationsExpanded = !this.locationsExpanded;
    this.expandAll.emit(this.locationsExpanded);
  }

  cellDurationChange(e: { value: number }): void {
    this.cellDuration = e.value;
    this.afterFilterChange();
  }

  format(value: any): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${value} min`;
  }

  dateValueChanged(): void {
    this.minToDate = this.from;
    this.recalculateInterval();
  }

  resetFilter(): void {
    this.cellDuration = DEFAULT_SCHEDULER_CELL_DURATION;
    this.from = this.project!.startTime.toDate();
    this.minToDate = this.from;
    this.to = this.project!.endTime.toDate();
    this.recalculateInterval();
  }

  private recalculateInterval(): void {
    // TODO: Devextreme timelineDay does not accept comma values
    // this.interval = (moment(this.to).diff(moment(this.from), 'hours') + 1) / 24;
    this.interval = moment(this.to).diff(moment(this.from), 'days') + 1;
    this.afterFilterChange();
  }

  private afterFilterChange(): void {
    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        [ROUTE_CELL_DURATION_PARAMETER_NAME]: this.cellDuration,
        [ROUTE_FROM_PARAMETER_NAME]: moment(this.from).toJSON(),
        [ROUTE_TO_PARAMETER_NAME]: moment(this.to).toJSON(),
        [ROUTE_INTERVAL_PARAMETER_NAME]: this.interval,
      },
      queryParamsHandling: 'merge',
    });
  }
}
