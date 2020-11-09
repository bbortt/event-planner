import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

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

  @Input()
  filter?: (search: string) => void;

  searchForm = this.fb.group({
    search: [],
  });

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm
      .get('search')!
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        debounce(() => DEFAULT_DEBOUNCE)
      )
      .subscribe(searchString => this.filter!(searchString));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
