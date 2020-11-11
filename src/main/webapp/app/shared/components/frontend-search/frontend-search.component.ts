import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounce, takeUntil } from 'rxjs/operators';
import { DEFAULT_DEBOUNCE } from 'app/app.constants';

@Component({
  selector: 'app-frontend-search',
  templateUrl: './frontend-search.component.html',
  styleUrls: ['./frontend-search.component.scss'],
})
export class FrontendSearchComponent implements OnInit, OnDestroy {
  @Input()
  placeholder?: string;

  @Output()
  valueChange = new EventEmitter<string>();

  searchForm: FormControl = new FormControl();

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounce(() => DEFAULT_DEBOUNCE)
      )
      .subscribe(searchValue => this.valueChange.emit(searchValue));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
