import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { JhiEventManager } from 'ng-jhipster';

import { Project } from 'app/shared/model/project.model';
import { ProjectService } from 'app/entities/project/project.service';

import { faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-project-admin',
  templateUrl: './project-admin.component.html',
  styleUrls: ['project-admin.component.scss'],
})
export class ProjectAdminComponent implements OnInit, OnDestroy {
  faBook = faBook;

  project?: Project;
  eventSubscriber?: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected eventManager: JhiEventManager,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
      if (this.router.isActive(`/project/${(project as Project).id!}/admin`, true)) {
        this.router.navigate(['locations'], { relativeTo: this.activatedRoute.parent });
      }
    });
    this.eventSubscriber = this.eventManager.subscribe('projectDataModification', () => this.loadProject());
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  private loadProject(): void {
    this.projectService.find(this.project!.id!).subscribe(response => (this.project = response.body as Project));
  }
}
