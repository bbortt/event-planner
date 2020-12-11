import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Project } from 'app/shared/model/project.model';
import { Location } from 'app/shared/model/location.model';

import { LocationService } from 'app/entities/location/location.service';
import { ProjectLocationDeleteDialogComponent } from 'app/view/project/admin/locations/project-location-delete-dialog.component';
import { Section } from 'app/shared/model/section.model';
import { ProjectSectionDeleteDialogComponent } from 'app/view/project/admin/locations/sections/project-section-delete-dialog.component';

@Component({
  selector: 'app-project-locations',
  templateUrl: './project-locations.component.html',
  styleUrls: ['project-locations.component.scss'],
})
export class ProjectLocationsComponent implements OnInit, OnDestroy {
  project?: Project;
  locations?: Location[];

  eventSubscriber?: Subscription;

  predicate = 'name';
  ascending = true;

  constructor(
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
      this.loadPage();
      this.registerChangeInLocations();
      this.registerChangeInSections();
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  registerChangeInLocations(): void {
    this.eventSubscriber = this.eventManager.subscribe('locationListModification', () => this.loadPage());
  }

  registerChangeInSections(): void {
    this.eventSubscriber = this.eventManager.subscribe('sectionListModification', () => this.loadPage());
  }

  loadPage(): void {
    this.locationService.findAllByProject(this.project!).subscribe((res: HttpResponse<Location[]>) => this.onSuccess(res.body));
  }

  deleteLocation(location: Location): void {
    const modalRef = this.modalService.open(ProjectLocationDeleteDialogComponent, { backdrop: 'static' });
    modalRef.componentInstance.location = location;
  }

  deleteSection(section: Section): void {
    const modalRef = this.modalService.open(ProjectSectionDeleteDialogComponent, { backdrop: 'static' });
    modalRef.componentInstance.section = section;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: Location[] | null): void {
    this.router.navigate(['/project', this.project!.id!, 'admin', 'locations'], {
      queryParams: {
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
      },
    });
    this.locations = data || [];
  }
}
