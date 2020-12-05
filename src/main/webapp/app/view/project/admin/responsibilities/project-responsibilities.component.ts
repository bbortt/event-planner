import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Project } from 'app/shared/model/project.model';
import { Responsibility } from 'app/shared/model/responsibility.model';

import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { ProjectResponsibilityDeleteDialogComponent } from 'app/view/project/admin/responsibilities/project-responsibility-delete-dialog.component';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';

@Component({
  selector: 'app-project-responsibilities',
  templateUrl: './project-responsibilities.component.html',
  styleUrls: ['project-responsibilities.component.scss'],
})
export class ProjectResponsibilitiesComponent implements OnInit, OnDestroy {
  project?: Project;
  loadedResponsibilities?: Responsibility[];
  responsibilities?: Responsibility[];

  eventSubscriber?: Subscription;

  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate = 'name';
  ascending = true;
  ngbPaginationPage = 1;

  constructor(
    protected responsibilityService: ResponsibilityService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
      this.handleNavigation();
      this.registerChangeInResponsibilities();
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  protected handleNavigation(): void {
    combineLatest(this.activatedRoute.data, this.activatedRoute.queryParamMap, (data: Data, params: ParamMap) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      if (pageNumber !== this.page) {
        this.loadPage(pageNumber, true);
      }
    }).subscribe();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;

    this.responsibilityService
      .findAllByProject(this.project!, {
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<Responsibility[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
        () => this.onError()
      );
  }

  trackId(index: number, item: Responsibility): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInResponsibilities(): void {
    this.eventSubscriber = this.eventManager.subscribe('responsibilityListModification', () => this.loadPage());
  }

  filterData(searchString: string): void {
    this.responsibilities = this.loadedResponsibilities!.filter((responsibility: Responsibility) =>
      responsibility.name?.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  delete(responsibility: Responsibility): void {
    const modalRef = this.modalService.open(ProjectResponsibilityDeleteDialogComponent, { backdrop: 'static' });
    modalRef.componentInstance.responsibility = responsibility;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: Responsibility[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/project', this.project!.id!, 'admin', 'responsibilities'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.loadedResponsibilities = data || [];
    this.responsibilities = this.loadedResponsibilities;
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
