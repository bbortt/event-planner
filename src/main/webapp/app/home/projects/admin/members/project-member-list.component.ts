import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';

import { combineLatest, filter, Observable, of, Subscription, switchMap, tap } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import dayjs from 'dayjs/esm';

import { GetProjectMembers200Response, Member, Project, ProjectMemberService } from 'app/api';

import { ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AlertService } from 'app/core/util/alert.service';

import MemberDeleteDialogComponent from 'app/entities/member/delete/member-delete-dialog.component';
import { MemberService } from 'app/entities/member/service/member.service';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ItemCountComponent } from 'app/shared/pagination';
import { SortByDirective, SortDirective } from 'app/shared/sort';

@Component({
  standalone: true,
  selector: 'app-project-member-list',
  templateUrl: './project-member-list.component.html',
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
export default class ProjectMemberListComponent implements OnDestroy, OnInit {
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
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private applicationConfigService: ApplicationConfigService,
    private memberService: MemberService,
    private modalService: NgbModal,
    private projectMemberService: ProjectMemberService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        tap(({ project }) => {
          if (project) {
            this.project = project;
          }
        }),
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

  protected load(): void {
    this.loadFromBackendWithRouteInformation().subscribe({
      next: (res: HttpResponse<GetProjectMembers200Response>) => {
        this.onResponseSuccess(res);
      },
    });
  }

  protected navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  protected copyInvitationLink(): void {
    const projectInvitationUri = `invitation/projects/${this.project!.token}`;

    of(
      navigator.clipboard.writeText(`${window.location.origin}/${this.applicationConfigService.getEndpointFor(projectInvitationUri)}`),
    ).subscribe(() =>
      this.alertService.addAlert({
        type: 'info',
        translationKey: 'app.project.admin.invitationLinkCopied',
      }),
    );
  }

  protected delete(member: Member): void {
    const modalRef = this.modalService.open(MemberDeleteDialogComponent, { size: 'lg' });
    modalRef.componentInstance.member = member;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformation()),
      )
      .subscribe({
        next: (res: HttpResponse<GetProjectMembers200Response>) => {
          this.onResponseSuccess(res);
        },
      });
  }

  protected convertToDayjs(date: string): dayjs.Dayjs | null | undefined {
    return dayjs(date);
  }

  protected navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  private loadFromBackendWithRouteInformation(): Observable<HttpResponse<GetProjectMembers200Response>> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending)),
    );
  }

  private fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  private onResponseSuccess(response: HttpResponse<GetProjectMembers200Response>): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    this.members = this.fillComponentAttributesFromResponseBody(response.body?.contents);
  }

  private fillComponentAttributesFromResponseBody(data: Array<Member> | undefined): Member[] {
    return data ?? [];
  }

  private fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  private queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<HttpResponse<GetProjectMembers200Response>> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    return this.projectMemberService
      .getProjectMembers(this.project!.id!, this.itemsPerPage, pageToLoad, this.getSortQueryParam(predicate, ascending), 'response')
      .pipe(tap(() => (this.isLoading = false)));
  }

  private handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router
      .navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      })
      .catch(() => window.location.reload());
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
