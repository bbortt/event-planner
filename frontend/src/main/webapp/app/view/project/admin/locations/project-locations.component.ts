import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import {EventManager} from 'app/core/util/event-manager.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LocationService } from 'app/entities/location/location.service';

import { Location } from 'app/entities/location/location.model';
import { Project } from 'app/entities/project/project.model';
import { Section } from 'app/entities/section/section.model';

import { ProjectLocationDeleteDialogComponent } from 'app/view/project/admin/locations/project-location-delete-dialog.component';
import { ProjectSectionDeleteDialogComponent } from 'app/view/project/admin/locations/sections/project-section-delete-dialog.component';

import { Role } from 'app/config/role.constants';

@Component({
  selector: 'app-project-locations',
  templateUrl: './project-locations.component.html',
  styleUrls: ['./project-locations.component.scss'],
})
export class ProjectLocationsComponent implements OnInit, OnDestroy {
  project?: Project;
  loadedLocations?: Location[];
  locations?: Location[];

  eventSubscriber?: Subscription;

  roleAdmin = Role.ADMIN.name;

  constructor(
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: EventManager,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        tap((data: Data) => this.project = data.project as Project),
        tap(() => this.loadLocations())
      )
      .subscribe(() => {
        this.registerChangeInLocations();
        this.registerChangeInSections();
      });
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
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
      location.name.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  protected onSuccess(data: Location[] | null): void {
    this.locations = data ?? [];
  }

  private registerChangeInLocations(): void {
    this.eventSubscriber = this.eventManager.subscribe('locationListModification', () => this.loadLocations());
  }

  private registerChangeInSections(): void {
    this.eventSubscriber = this.eventManager.subscribe('sectionListModification', () => this.loadLocations());
  }

  private loadLocations(): void {
    this.locationService.findAllByProjectInclusiveSections(this.project!).subscribe((response: HttpResponse<Location[]>) => {
      this.loadedLocations = response.body ?? [];
      this.locations = this.loadedLocations;
    });
  }
}
