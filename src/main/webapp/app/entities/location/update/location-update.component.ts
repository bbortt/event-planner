import { Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

import SharedModule from 'app/shared/shared.module';

import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

import { LocationFormService, LocationFormGroup } from './location-form.service';

@Component({
  standalone: true,
  selector: 'jhi-location-update',
  templateUrl: './location-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export default class LocationUpdateComponent implements OnInit {
  isSaving = false;
  location: ILocation | null = null;

  projectsSharedCollection: IProject[] = [];
  locationsSharedCollection: ILocation[] = [];

  editForm: LocationFormGroup;

  constructor(
    private angularLocation: Location,
    private eventManager: EventManager,
    protected locationService: LocationService,
    protected locationFormService: LocationFormService,
    protected projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.editForm = this.locationFormService.createLocationFormGroup();
  }

  compareProject = (o1: IProject | null, o2: IProject | null): boolean => this.projectService.compareProject(o1, o2);

  compareLocation = (o1: ILocation | null, o2: ILocation | null): boolean => this.locationService.compareLocation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.location = location;
      if (location) {
        this.updateForm(location);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    this.angularLocation.back();
  }

  save(): void {
    this.isSaving = true;
    const location = this.locationFormService.getLocation(this.editForm);
    if (location.id !== null) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: response => this.onSaveError(response),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(httpErrorResponse: HttpErrorResponse): void {
    this.eventManager.broadcast(new EventWithContent('app.httpError', httpErrorResponse));
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(location: ILocation): void {
    this.location = location;
    this.locationFormService.resetForm(this.editForm, location);

    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing<IProject>(
      this.projectsSharedCollection,
      location.project,
    );
    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing<ILocation>(
      this.locationsSharedCollection,
      location.parent,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projectService
      .query()
      .pipe(
        map((res: HttpResponse<IProject[]>) => res.body ?? []),
        map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing<IProject>(projects, this.location?.project)),
      )
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));

    this.locationService
      .query()
      .pipe(
        map((res: HttpResponse<ILocation[]>) => res.body ?? []),
        map((locations: ILocation[]) => this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.location?.parent)),
      )
      .subscribe((locations: ILocation[]) => (this.locationsSharedCollection = locations));
  }
}
