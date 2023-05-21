import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { LocationFormGroup, LocationFormService } from 'app/entities/location/update/location-form.service';
import { IProject } from 'app/entities/project/project.model';

@Component({
  selector: 'app-project-location-update',
  templateUrl: './project-location-update.component.html',
})
export class ProjectLocationUpdateComponent implements OnInit {
  project: IProject | null = null;
  parentLocation: ILocation | null = null;

  isSaving = false;
  existingLocation: ILocation | null = null;

  locationsSharedCollection: ILocation[] = [];

  editForm: LocationFormGroup;

  constructor(
    private eventManager: EventManager,
    protected locationService: LocationService,
    protected locationFormService: LocationFormService
  ) {
    this.editForm = this.locationFormService.createLocationFormGroup();
  }

  ngOnInit(): void {
    if (this.existingLocation) {
      this.updateForm(this.existingLocation);
    } else {
      if (this.parentLocation) {
        this.editForm.get('parent')?.setValue(this.parentLocation);
        this.editForm.controls.parent.disable();
      }

      if (this.project) {
        this.editForm.get('project')?.setValue(this.project);
      }
    }

    this.loadRelationshipsOptions();
  }

  compareLocation = (o1: ILocation | null, o2: ILocation | null): boolean => this.locationService.compareLocation(o1, o2);

  previousState(): void {
    window.history.back();
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
    this.locationFormService.resetForm(this.editForm, location);

    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing<ILocation>(
      this.locationsSharedCollection,
      location.parent
    );
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query()
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.existingLocation?.parent)
        )
      )
      .subscribe((locations: ILocation[]) => (this.locationsSharedCollection = locations));
  }
}
