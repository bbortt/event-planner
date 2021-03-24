import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { EventManager } from 'app/core/util/event-manager.service';
import { ParseLinks } from 'app/core/util/parse-links.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, range, Subscription } from 'rxjs';
import { finalize, map, mergeMap, take, tap } from 'rxjs/operators';

import { ProjectService } from 'app/entities/project/project.service';
import { AccountService } from 'app/core/auth/account.service';

import { Project } from 'app/entities/project/project.model';

import { faArrowDown, faBook, faCog } from '@fortawesome/free-solid-svg-icons';
import { Authority } from 'app/config/authority.constants';
import { Role } from 'app/config/role.constants';

type PagedEntity = { page: number; projects: Project[]; links: { next?: number; last: number } };

const ROUTE_PARAM_SHOW_ARCHIVED = 'showArchived';
const ROUTE_PARAM_SHOW_ALL = 'showAll';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss'],
})
export class MyProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  filteredProjects: Project[][] = [];

  eventSubscriber?: Subscription;

  // itemsPerPage = ITEMS_PER_PAGE;
  itemsPerPage = 3;
  links = {
    last: 0,
  };
  page = 0;
  predicate = 'startTime';
  ascending = true;

  faArrowDown = faArrowDown;
  faBook = faBook;
  faCog = faCog;

  authorityAdmin = Authority.ADMIN;
  adminRoles = [Role.ADMIN.name, Role.SECRETARY.name];

  showArchivedProjects = false;
  showAllProjects = false;
  loadMoreButtonEnabled = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventManager: EventManager,
    private modalService: NgbModal,
    private projectService: ProjectService,
    private accountService: AccountService,
    private parseLinks: ParseLinks
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        take(1),
        tap((params: Params) => {
          this.showArchivedProjects = params[ROUTE_PARAM_SHOW_ARCHIVED] === 'true';
          this.showAllProjects = params[ROUTE_PARAM_SHOW_ALL] === 'true';
        })
      )
      .subscribe(() => {
        this.reset();
        this.registerChangeInSomeEntities();
      });
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  reset(): void {
    this.router.navigate(['.'], {
      replaceUrl: false,
      queryParams: {
        [ROUTE_PARAM_SHOW_ARCHIVED]: this.showArchivedProjects,
        [ROUTE_PARAM_SHOW_ALL]: this.showAllProjects,
      },
    });

    let page = -1;
    const projects: Project[] = [];
    const filteredProjects: Project[][] = [];
    let links = { last: 0 };
    let loadMoreButtonEnabled = false;

    range(0, this.page + 1)
      .pipe(
        mergeMap((nextPage: number) => this.loadPage(nextPage)),
        finalize(() => {
          this.fillLastRow(filteredProjects);

          this.page = page;
          this.projects = projects;
          this.filteredProjects = filteredProjects;
          this.links = links;
          this.loadMoreButtonEnabled = loadMoreButtonEnabled;
        })
      )
      .subscribe((pagedEntity: PagedEntity) => {
        const newProjects = pagedEntity.projects;
        page = pagedEntity.page;
        projects.push(...newProjects);
        filteredProjects.push(newProjects);
        links = pagedEntity.links;
        loadMoreButtonEnabled = 'next' in links;
      });
  }

  loadNextPage(): void {
    this.page++;
    this.loadPage(this.page)
      .pipe(finalize(() => this.fillLastRow(this.filteredProjects)))
      .subscribe((pagedEntity: PagedEntity) => {
        const { page, projects, links } = pagedEntity;
        this.page = page;
        this.projects.push(...projects);
        this.filteredProjects.push(projects);
        this.links = links;
        this.loadMoreButtonEnabled = !!links.next;
      });
  }

  trackId(index: number, item: Project): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInSomeEntities(): void {
    this.eventSubscriber = this.eventManager.subscribe('myProjectsListModification', () => this.reset());
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  filterData(searchString: string): void {
    if (!searchString) {
      this.reset();
    }

    const matchingProjects = this.projects.filter((project: Project) => project.name.toLowerCase().includes(searchString.toLowerCase()));

    this.filteredProjects = [];

    for (let i = 0; i < matchingProjects.length; i++) {
      if (i % 3 === 0) {
        this.filteredProjects.push([]);
      }

      this.filteredProjects[this.filteredProjects.length - 1].push(matchingProjects[i]);
    }

    this.fillLastRow(this.filteredProjects);
  }

  private loadPage(page: number): Observable<PagedEntity> {
    return this.projectService
      .query({
        page,
        size: this.itemsPerPage,
        sort: this.sort(),
        loadArchived: this.showArchivedProjects,
        loadAll: this.accountService.hasAnyAuthority(Authority.ADMIN) && this.showAllProjects,
      })
      .pipe(map((res: HttpResponse<Project[]>) => this.paginateSomeEntities(page, res.body, res.headers)));
  }

  private fillLastRow(rows: Project[][]): void {
    while (rows[rows.length - 1] && rows[rows.length - 1].length % 3 !== 0) {
      rows[rows.length - 1].push({} as Project);
      this.loadMoreButtonEnabled = false;
    }
  }

  private paginateSomeEntities(page: number, newProjects: Project[] | null, headers: HttpHeaders): PagedEntity {
    const headersLink = headers.get('link');
    const links = this.parseLinks.parse(headersLink ? headersLink : '');
    return { page, projects: newProjects ?? [], links: { next: links['next'], last: links['last'] } };
  }
}
