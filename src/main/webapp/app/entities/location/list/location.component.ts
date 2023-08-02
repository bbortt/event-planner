import { HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';

import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEMS_PER_PAGE, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ItemCountComponent } from 'app/shared/pagination';
import { SortByDirective, SortDirective } from 'app/shared/sort';

import LocationDeleteDialogComponent from '../delete/location-delete-dialog.component';
import { ILocation } from '../location.model';
import { IProject } from '../../project/project.model';
import { EntityArrayResponseType, LocationService } from '../service/location.service';

@Component({
  standalone: true,
  selector: 'jhi-location',
  templateUrl: './location.component.html',
  imports: [
    SharedModule,
    RouterModule,
    FormsModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
  ],
})
export default class LocationComponent implements OnInit {
  locations?: ILocation[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  constructor(
    protected locationService: LocationService,
    private activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    private ngZone: NgZone,
    private router: Router
  ) {}

  trackId = (_index: number, item: ILocation): number => this.locationService.getLocationIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(location: ILocation): void {
    const modalRef = this.modalService.open(LocationDeleteDialogComponent, { size: 'lg' });
    modalRef.componentInstance.location = location;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformation())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformation().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformation(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.locations = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IProject[] | null): IProject[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.locationService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.ngZone.run(() =>
      this.router
        .navigate(['./'], {
          relativeTo: this.activatedRoute,
          queryParams: queryParamsObj,
        })
        .catch(() => window.location.reload())
    );
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
