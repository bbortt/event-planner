import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { DEFAULT_CELL_DURATION } from 'app/app.constants';

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

  defaultCellDuration = DEFAULT_CELL_DURATION;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.allExpanded!.pipe(takeUntil(this.destroy$)).subscribe((allExpanded: boolean) => (this.locationsExpanded = allExpanded));
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
    this.onCellDurationChange.emit(e.value);
  }

  format(value: any): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${value} min`;
  }
}
