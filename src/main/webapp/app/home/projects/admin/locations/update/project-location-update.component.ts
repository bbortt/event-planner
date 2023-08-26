import { Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

import { GetProjectLocations200Response, Location as ApiLocation, ProjectLocationService } from 'app/api';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { LocationFormGroup, LocationFormService } from 'app/entities/location/update/location-form.service';
import { IProject } from 'app/entities/project/project.model';

import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-project-location-update',
  templateUrl: './project-location-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export default class ProjectLocationUpdateComponent {
  @Input() project: IProject | null = null;
  @Input() parentLocation: ILocation | null = null;

  isSaving = false;
  existingLocation: ILocation | null = null;

  locationsSharedCollection: ILocation[] = [];

  editForm: LocationFormGroup;

  constructor(
    private eventManager: EventManager,
    private location: Location,
    private locationService: LocationService,
    private locationFormService: LocationFormService,
    private projectLocationService: ProjectLocationService,
  ) {
    this.editForm = this.locationFormService.createLocationFormGroup();
  }

  lateInit(): void {
    if (this.locationsSharedCollection.length === 0) {
      this.loadRelationshipsOptions();
      this.disableInformativeFields();
    }
  }

  compareLocation = (o1: ILocation | null, o2: ILocation | null): boolean => this.locationService.compareLocation(o1, o2);

  previousState(): void {
    this.location.historyGo(-2);
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
      location.parent,
    );
  }

  protected loadRelationshipsOptions(): void {
    if (this.project && this.existingLocation) {
      this.prepareRelationshipsOptions(
        this.projectLocationService.getProjectLocationsWithoutSelf(this.project.id, this.existingLocation.id, 'response'),
      );
    } else if (this.project) {
      this.prepareRelationshipsOptions(this.projectLocationService.getProjectLocations(this.project.id, 'response'));
    }
  }

  private prepareRelationshipsOptions(projectLocations: Observable<HttpResponse<GetProjectLocations200Response>>): void {
    projectLocations
      .pipe(
        map((res: HttpResponse<GetProjectLocations200Response>) => res.body?.contents ?? []),
        map((locations: ApiLocation[]) => this.flattenLocations(locations)),
        map((locations: ApiLocation[]) =>
          locations.map(
            (location: ApiLocation) => ({ id: location.id, name: location.name, description: location.description }) as ILocation,
          ),
        ),
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.existingLocation?.parent),
        ),
        tap((locations: ILocation[]) => (this.locationsSharedCollection = locations)),
      )
      .subscribe(() => this.updateLocationDefaultValues());
  }

  private flattenLocations(locations: ApiLocation[]): ApiLocation[] {
    const flattenedLocations: ApiLocation[] = [];

    for (const rawLocation of locations) {
      flattenedLocations.push(rawLocation);
      this.flattenLocations(rawLocation.children).forEach(flattenedLocation => flattenedLocations.push(flattenedLocation));
    }

    return flattenedLocations;
  }

  private updateLocationDefaultValues(): void {
    if (this.existingLocation) {
      this.updateForm(this.existingLocation);
    } else {
      if (this.parentLocation) {
        this.editForm.controls.parent.setValue(this.parentLocation);
        this.editForm.controls.parent.disable();
      }

      if (this.project) {
        this.editForm.get('project')?.setValue(this.project);
      }
    }
  }

  private disableInformativeFields(): void {
    this.editForm.controls.createdBy.disable();
    this.editForm.controls.createdDate.disable();
    this.editForm.controls.lastModifiedBy.disable();
    this.editForm.controls.lastModifiedDate.disable();
  }
}
