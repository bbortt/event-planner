import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';

import {EventManager} from 'app/core/util/event-manager.service';

import { Project } from 'app/entities/project/project.model';
import { Responsibility } from 'app/entities/responsibility/responsibility.model';

import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { ProjectResponsibilityDeleteDialogComponent } from 'app/view/project/admin/responsibilities/project-responsibility-delete-dialog.component';

import { DEFAULT_SCHEDULER_COLOR } from 'app/app.constants';

@Component({
  selector: 'app-project-responsibilities',
  templateUrl: './project-responsibilities.component.html',
  styleUrls: ['./project-responsibilities.component.scss'],
})
export class ProjectResponsibilitiesComponent implements OnInit, OnDestroy {
  project?: Project;
  loadedResponsibilities?: Responsibility[];
  responsibilities?: Responsibility[];

  defaultColor = DEFAULT_SCHEDULER_COLOR;

  eventSubscriber?: Subscription;

  constructor(
    protected responsibilityService: ResponsibilityService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: EventManager,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
      this.loadResponsibilities();
      this.registerChangeInResponsibilities();
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  loadResponsibilities(): void {
    this.responsibilityService
      .findAllByProject(this.project!, { sort: ['name,asc'] })
      .subscribe((response: HttpResponse<Responsibility[]>) => {
        this.loadedResponsibilities = response.body ?? [];
        this.responsibilities = this.loadedResponsibilities;
      });
  }

  trackId(index: number, item: Responsibility): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInResponsibilities(): void {
    this.eventSubscriber = this.eventManager.subscribe('responsibilityListModification', () => this.loadResponsibilities());
  }

  filterData(searchString: string): void {
    this.responsibilities = this.loadedResponsibilities!.filter((responsibility: Responsibility) =>
      responsibility.name.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  delete(responsibility: Responsibility): void {
    const modalRef = this.modalService.open(ProjectResponsibilityDeleteDialogComponent, { backdrop: 'static' });
    modalRef.componentInstance.responsibility = responsibility;
  }
}
