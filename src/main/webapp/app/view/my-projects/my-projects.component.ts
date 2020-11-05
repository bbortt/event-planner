import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProject } from 'app/shared/model/project.model';

import { ProjectService } from 'app/entities/project/project.service';
import { AccountService } from 'app/core/auth/account.service';

import { faArrowDown, faBook, faCog } from '@fortawesome/free-solid-svg-icons';

import { AUTHORITY_ADMIN } from 'app/shared/constants/authority.constants';
import { ROLE_ADMIN, ROLE_CONTRIBUTOR, ROLE_SECRETARY, ROLE_VIEWER } from 'app/shared/constants/role.constants';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss'],
})
export class MyProjectsComponent implements OnInit, OnDestroy {
  projects: IProject[][];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  faArrowDown = faArrowDown;
  faBook = faBook;
  faCog = faCog;

  adminRoles = [ROLE_ADMIN, ROLE_SECRETARY];
  viewerRoles = [ROLE_CONTRIBUTOR, ROLE_VIEWER];

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
  ) {
    this.projects = [];
    this.itemsPerPage = 3;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

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
      .subscribe((res: HttpResponse<IProject[]>) => this.paginateSomeEntities(res.body, res.headers));
  }

  reset(): void {
    this.projects = [];
    const lastPage = this.page;

    for (let i = 0; i <= lastPage; i++) {
      this.loadPage(i);
    }
  }

  trackId(index: number, item: IProject): number {
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

  private paginateSomeEntities(newProjects: IProject[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (newProjects && newProjects.length > 0) {
      this.projects.push(newProjects);

      while (this.projects[this.projects.length - 1].length % 3 !== 0) {
        this.projects[this.projects.length - 1].push({});
        this.loadMoreButtonEnabled = false;
      }
    } else {
      this.loadMoreButtonEnabled = false;
    }
  }

  switchShowAllProjects(): void {
    this.showAllProjects = !this.showAllProjects;
    this.reset();
  }
}
