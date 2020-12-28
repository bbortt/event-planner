import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Project } from 'app/shared/model/project.model';

import { ProjectService } from 'app/entities/project/project.service';
import { AccountService } from 'app/core/auth/account.service';

import { faArrowDown, faBook, faCog } from '@fortawesome/free-solid-svg-icons';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { AUTHORITY_ADMIN } from 'app/shared/constants/authority.constants';
import { ADMIN, SECRETARY } from 'app/shared/constants/role.constants';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss'],
})
export class MyProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  filteredProjects: Project[][] = [];

  eventSubscriber?: Subscription;

  itemsPerPage = ITEMS_PER_PAGE;
  links = {
    last: 0,
  };
  page = 0;
  predicate = 'startTime';
  ascending = true;

  faArrowDown = faArrowDown;
  faBook = faBook;
  faCog = faCog;

  authorityAdmin = AUTHORITY_ADMIN;
  adminRoles = [ADMIN.name, SECRETARY.name];

  showAllProjects = false;
  loadMoreButtonEnabled = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventManager: JhiEventManager,
    private modalService: NgbModal,
    private projectService: ProjectService,
    private accountService: AccountService,
    private parseLinks: JhiParseLinks
  ) {}

  ngOnInit(): void {
    this.loadPage(this.page);
    this.registerChangeInSomeEntities();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  loadPage(page: number): void {
    this.page = page;
    this.projectService
      .query({
        page,
        size: this.itemsPerPage,
        sort: this.sort(),
        loadAll: this.accountService.hasAnyAuthority(AUTHORITY_ADMIN) && this.showAllProjects,
      })
      .subscribe((res: HttpResponse<Project[]>) => this.paginateSomeEntities(res.body, res.headers));
  }

  reset(): void {
    this.projects = [];
    this.filteredProjects = [];
    const lastPage = this.page;

    for (let i = 0; i <= lastPage; i++) {
      this.loadPage(i);
    }
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

    const matchingProjects = this.projects.filter((project: Project) => project.name?.toLowerCase().includes(searchString.toLowerCase()));

    this.filteredProjects = [];

    for (let i = 0; i < matchingProjects.length; i++) {
      if (i % 3 === 0) {
        this.filteredProjects.push([]);
      }

      this.filteredProjects[this.filteredProjects.length - 1].push(matchingProjects[i]);
    }

    this.fillRow();
  }

  private fillRow(): void {
    while (
      this.filteredProjects[this.filteredProjects.length - 1] &&
      this.filteredProjects[this.filteredProjects.length - 1].length % 3 !== 0
    ) {
      this.filteredProjects[this.filteredProjects.length - 1].push({});
      this.loadMoreButtonEnabled = false;
    }
  }

  private paginateSomeEntities(newProjects: Project[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (newProjects && newProjects.length > 0) {
      this.projects.push(...newProjects);
      this.filteredProjects.push(newProjects);

      this.fillRow();
    } else {
      this.loadMoreButtonEnabled = false;
    }
  }

  switchShowAllProjects(): void {
    this.showAllProjects = !this.showAllProjects;
    this.reset();
  }
}
