import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProject } from 'app/shared/model/project.model';

import { ProjectService } from 'app/entities/project/project.service';
import { AccountService } from 'app/core/auth/account.service';

import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-my-projects',
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

  showAllProjects = false;
  loadMoreButtonEnabled = true;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager,
    private modalService: NgbModal,
    private accountService: AccountService,
    protected parseLinks: JhiParseLinks
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

  loadAll(): void {
    this.projectService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
        loadAll: this.accountService.hasAnyAuthority('ROLE_ADMIN') && this.showAllProjects,
      })
      .subscribe((res: HttpResponse<IProject[]>) => this.paginateSomeEntities(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.projects = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInSomeEntities();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
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

  protected paginateSomeEntities(newProjects: IProject[] | null, headers: HttpHeaders): void {
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
