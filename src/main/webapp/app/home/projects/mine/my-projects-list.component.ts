import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';

import { combineLatest, Observable, Subscription, switchMap, tap } from 'rxjs';

import { GetUserProjects200Response, Project, ProjectService as ApiProjectService } from '../../../api';

import { HAS_NEXT_PAGE_HEADER } from '../../../config/pagination.constants';
import { ASC, DEFAULT_SORT_DATA, DESC, SORT } from '../../../config/navigation.constants';

import { IProject } from '../../../entities/project/project.model';
import { ProjectService } from '../../../entities/project/service/project.service';

@Component({
  selector: 'app-my-projects-list',
  templateUrl: './my-projects-list.component.html',
})
export class MyProjectsListComponent implements OnInit, OnDestroy {
  projects?: IProject[][];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = 3;
  hasNextPage = true;
  page = 1;

  private projectUpdatedSource: Subscription | null = null;

  constructor(
    protected projectService: ProjectService,
    protected apiProjectService: ApiProjectService,
    protected activatedRoute: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.projectUpdatedSource = this.projectService.projectUpdatedSource$.subscribe(() => this.load());

    this.load();
  }

  ngOnDestroy(): void {
    if (this.projectUpdatedSource) {
      this.projectUpdatedSource.unsubscribe();
    }
  }

  loadPage(page: number): void {
    this.page = page;
    this.load();
  }

  trackId = (_index: number, item: IProject): number => this.projectService.getProjectIdentifier(item);

  load(): void {
    this.loadFromBackendWithRouteInformation().subscribe({
      next: (res: HttpResponse<GetUserProjects200Response>) => {
        this.onResponseSuccess(res);
      },
    });
  }

  protected loadFromBackendWithRouteInformation(): Observable<HttpResponse<GetUserProjects200Response>> {
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

  protected onResponseSuccess(response: HttpResponse<GetUserProjects200Response>): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body?.contents);

    this.projects = this.createTriplets([...(this.projects ?? []).flatMap(p => p), ...dataFromBody]);
  }

  protected fillComponentAttributesFromResponseBody(data: Array<Project> | undefined): IProject[] {
    return (data ?? []).map(
      project =>
        ({
          id: project.id,
          name: project.name,
          description: project.description,
        } as IProject)
    );
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.hasNextPage = 'true' === headers.get(HAS_NEXT_PAGE_HEADER);
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<HttpResponse<GetUserProjects200Response>> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    return this.apiProjectService
      .getUserProjects(this.itemsPerPage, pageToLoad, this.getSortQueryParam(predicate, ascending), 'response', false, {})
      .pipe(tap(() => (this.isLoading = false)));
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + encodeURI(',') + ascendingQueryParam];
    }
  }

  private createTriplets(projects: IProject[]): IProject[][] {
    const triplets: IProject[][] = [];

    for (let i = 0; i < this.page; i++) {
      triplets.push([]);

      for (let j = 0; j < this.itemsPerPage; j++) {
        const currentIndex = i * this.itemsPerPage + j;
        if (currentIndex < projects.length) {
          triplets[i].push(projects[currentIndex]);
        }
      }
    }

    return triplets;
  }
}
