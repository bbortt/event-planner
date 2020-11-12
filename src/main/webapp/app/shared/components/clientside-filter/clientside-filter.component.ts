import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DEFAULT_DEBOUNCE } from 'app/app.constants';

@Component({
  selector: 'app-clientside-filter',
  templateUrl: './clientside-filter.component.html',
  styleUrls: ['./clientside-filter.component.scss'],
})
export class ClientsideFilterComponent implements OnInit, OnDestroy {
  @Input()
  placeholder?: string;

  @Output()
  valueChange = new EventEmitter<string>();

  searchControl = new FormControl();

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(DEFAULT_DEBOUNCE), takeUntil(this.destroy$)).subscribe(this.valueChange);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
