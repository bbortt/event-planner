import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { DEFAULT_CELL_DURATION } from 'app/app.constants';
import { ActivatedRoute, Params, Router } from '@angular/router';

const ROUTE_INTERVAL_PARAMETER_NAME = 'interval';

@Component({
  selector: 'app-project-screenplay-filter',
  templateUrl: './project-screenplay-filter.component.html',
  styleUrls: ['project-screenplay-filter.component.scss'],
})
export class ProjectScreenplayFilterComponent implements OnInit, OnDestroy {
  @Input()
  allExpanded?: EventEmitter<boolean>;

  @Output()
  public onExpandAll = new EventEmitter<boolean>();

  @Output()
  public onCellDurationChange = new EventEmitter<number>();

  chevronDown = faChevronDown;
  chevronUp = faChevronUp;

  locationsExpanded = false;

  cellDuration = DEFAULT_CELL_DURATION;

  private destroy$ = new Subject<void>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.allExpanded!.pipe(takeUntil(this.destroy$)).subscribe((allExpanded: boolean) => (this.locationsExpanded = allExpanded));

    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      const interval = params[ROUTE_INTERVAL_PARAMETER_NAME];
      if (interval) {
        this.cellDurationChange({ value: JSON.parse(interval) });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  expandLocations(): void {
    this.locationsExpanded = !this.locationsExpanded;
    this.onExpandAll.emit(this.locationsExpanded);
  }

  cellDurationChange(e: { value: number }): void {
    this.cellDuration = e.value;
    this.onCellDurationChange.emit(this.cellDuration);
    this.afterFilterChange();
  }

  format(value: any): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${value} min`;
  }

  private afterFilterChange(): void {
    // Update route
    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams: { [ROUTE_INTERVAL_PARAMETER_NAME]: JSON.stringify(this.cellDuration) },
      queryParamsHandling: 'merge',
    });
  }
}
