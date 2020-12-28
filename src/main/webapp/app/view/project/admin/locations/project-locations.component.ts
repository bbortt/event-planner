import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LocationService } from 'app/entities/location/location.service';

import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';
import { Section } from 'app/shared/model/section.model';

import { ProjectLocationDeleteDialogComponent } from 'app/view/project/admin/locations/project-location-delete-dialog.component';
import { ProjectSectionDeleteDialogComponent } from 'app/view/project/admin/locations/sections/project-section-delete-dialog.component';

import { ADMIN } from 'app/shared/constants/role.constants';

@Component({
  selector: 'app-project-locations',
  templateUrl: './project-locations.component.html',
  styleUrls: ['project-locations.component.scss'],
})
export class ProjectLocationsComponent implements OnInit, OnDestroy {
  project?: Project;
  loadedLocations?: Location[];
  locations?: Location[];

  eventSubscriber?: Subscription;

  roleAdmin = ADMIN.name;

  sortBy = 'name';
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
      this.loadLocations();
      this.registerChangeInLocations();
      this.registerChangeInSections();
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  private registerChangeInLocations(): void {
    this.eventSubscriber = this.eventManager.subscribe('locationListModification', () => this.loadLocations());
  }

  private registerChangeInSections(): void {
    this.eventSubscriber = this.eventManager.subscribe('sectionListModification', () => this.loadLocations());
  }

  private loadLocations(): void {
    this.locationService.findAllByProject(this.project!, { sort: ['name,asc'] }).subscribe((response: HttpResponse<Location[]>) => {
      this.loadedLocations = response.body || [];
      this.locations = this.loadedLocations;
    });
  }

  deleteLocation(location: Location): void {
    const modalRef = this.modalService.open(ProjectLocationDeleteDialogComponent, { backdrop: 'static' });
    modalRef.componentInstance.location = location;
  }

  deleteSection(section: Section): void {
    const modalRef = this.modalService.open(ProjectSectionDeleteDialogComponent, { backdrop: 'static' });
    modalRef.componentInstance.section = section;
  }

  filterData(searchString: string): void {
    this.locations = this.loadedLocations!.filter((location: Location) =>
      location.name?.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  protected onSuccess(data: Location[] | null): void {
    this.locations = data || [];
  }
}
