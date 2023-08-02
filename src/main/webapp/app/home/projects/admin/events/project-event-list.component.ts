import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';

import { combineLatest, filter, Observable, Subscription, switchMap, tap } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Event, GetProjectEvents200Response, Project, ProjectEventsService } from 'app/api';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';

import EventDeleteDialogComponent from 'app/entities/event/delete/event-delete-dialog.component';
import { EventService } from 'app/entities/event/service/event.service';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ItemCountComponent } from 'app/shared/pagination';
import { SortByDirective, SortDirective } from 'app/shared/sort';

@Component({
  standalone: true,
  selector: 'jhi-event',
  templateUrl: './project-event-list.component.html',
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
export default class ProjectEventListComponent implements OnInit {
  project: Project | null = null;

  events?: Event[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  private eventUpdatedSource: Subscription | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private modalService: NgbModal,
    private ngZone: NgZone,
    private projectEventsService: ProjectEventsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        tap(({ project }) => {
          if (project) {
            this.project = project;
          }
        })
      )
      .subscribe(() => this.load());

    this.eventUpdatedSource = this.eventService.eventUpdatedSource$.subscribe(() => this.load());
  }

  trackId = (_index: number, item: Event): number => this.eventService.getEventIdentifier(item);

  delete(event: Event): void {
    const modalRef = this.modalService.open(EventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.event = event;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformation())
      )
      .subscribe({
        next: (res: HttpResponse<GetProjectEvents200Response>) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformation().subscribe({
      next: (res: HttpResponse<GetProjectEvents200Response>) => {
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

  private loadFromBackendWithRouteInformation(): Observable<HttpResponse<GetProjectEvents200Response>> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  private fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  private onResponseSuccess(response: HttpResponse<GetProjectEvents200Response>): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body?.contents);
    this.events = dataFromBody;
  }

  private fillComponentAttributesFromResponseBody(data: Array<Event> | undefined): Event[] {
    return data ?? [];
  }

  private fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  private queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<HttpResponse<GetProjectEvents200Response>> {
    this.isLoading = true;

    const pageToLoad: number = page ?? 1;
    return this.projectEventsService
      .getProjectEvents(this.project!.id!, this.itemsPerPage, pageToLoad, this.getSortQueryParam(predicate, ascending), 'response')
      .pipe(tap(() => (this.isLoading = false)));
  }

  private handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.ngZone.run(() =>
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      })
    );
  }

  private getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
