import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';

import { combineLatest, filter, Observable, Subscription, switchMap, tap } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GetProjectMembers200Response, Member, Project, ProjectMemberService } from 'app/api';

import { ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';

import { MemberDeleteDialogComponent } from 'app/entities/member/delete/member-delete-dialog.component';
import { MemberService } from 'app/entities/member/service/member.service';

@Component({
  selector: 'jhi-project-member-list',
  templateUrl: './project-member-list.component.html',
})
export class ProjectMemberListComponent implements OnDestroy, OnInit {
  project: Project | null = null;

  members?: Member[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  private memberUpdatedSource: Subscription | null = null;

  constructor(
    protected memberService: MemberService,
    protected projectMemberService: ProjectMemberService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected modalService: NgbModal
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

    this.memberUpdatedSource = this.memberService.memberUpdatedSource$.subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    if (this.memberUpdatedSource) {
      this.memberUpdatedSource.unsubscribe();
    }
  }

  trackId = (_index: number, item: Member): number => this.memberService.getMemberIdentifier(item);

  delete(member: Member): void {
    const modalRef = this.modalService.open(MemberDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.member = member;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformation())
      )
      .subscribe({
        next: (res: HttpResponse<GetProjectMembers200Response>) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformation().subscribe({
      next: (res: HttpResponse<GetProjectMembers200Response>) => {
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

  protected loadFromBackendWithRouteInformation(): Observable<HttpResponse<GetProjectMembers200Response>> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: HttpResponse<GetProjectMembers200Response>): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body?.contents);
    this.members = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: Array<Member> | undefined): Member[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<HttpResponse<GetProjectMembers200Response>> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    return this.projectMemberService
      .getProjectMembers(this.project!.id!, this.itemsPerPage, pageToLoad, this.getSortQueryParam(predicate, ascending), 'response')
      .pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
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
