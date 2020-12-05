import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Project } from 'app/shared/model/project.model';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { ProjectService } from 'app/entities/project/project.service';

@Component({
  selector: 'app-project-admin',
  templateUrl: './project-admin.component.html',
  styleUrls: ['project-admin.component.scss'],
})
export class ProjectAdminComponent implements OnInit, OnDestroy {
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
    this.projectService.find(this.project!.id!).subscribe(project => (this.project = project.body as Project));
  }
}
