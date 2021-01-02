import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-project-screenplay-filter',
  templateUrl: './project-screenplay-filter.component.html',
  styleUrls: ['project-screenplay-filter.component.scss'],
})
export class ProjectScreenplayFilterComponent implements OnInit, OnDestroy {
  @Input()
  allExpanded?: EventEmitter<boolean>;

  @Output()
  onExpandAll = new EventEmitter<boolean>();

  chevronDown = faChevronDown;
  chevronUp = faChevronUp;

  locationsExpanded = false;

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
}
