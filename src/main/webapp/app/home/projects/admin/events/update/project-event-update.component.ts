import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { GetProjectLocations200Response, Location, ProjectLocationService } from 'app/api';

import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { EventFormService, EventFormGroup } from 'app/entities/event/update/event-form.service';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

import { IProject } from 'app/entities/project/project.model';

import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-project-event-update',
  templateUrl: './project-event-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export default class ProjectEventUpdateComponent {
  @Input() event: IEvent | null = null;
  @Input() project: IProject | null = null;

  isSaving = false;

  protected locationsSharedCollection: ILocation[] = [];

  protected editForm: EventFormGroup;

  constructor(
    private eventFormService: EventFormService,
    private eventService: EventService,
    private locationService: LocationService,
    private projectLocationService: ProjectLocationService
  ) {
    this.editForm = this.eventFormService.createEventFormGroup();
  }

  public updateForm(event: IEvent): void {
    this.event = event;
    this.eventFormService.resetForm(this.editForm, event);

    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing<ILocation>(
      this.locationsSharedCollection,
      event.location
    );
  }

  public loadRelationshipsOptions(): void {
    this.projectLocationService
      .getProjectLocations(this.project!.id, 'response')
      .pipe(map((res: HttpResponse<GetProjectLocations200Response>) => res.body?.contents ?? []))
      .pipe(map((locations: Location[]) => locations.map(({ id, name, description }) => ({ id, name, description } as ILocation))))
      .pipe(
        map((locations: ILocation[]) => this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.event?.location))
      )
      .subscribe((locations: ILocation[]) => (this.locationsSharedCollection = locations));
  }

  compareLocation = (o1: ILocation | null, o2: ILocation | null): boolean => this.locationService.compareLocation(o1, o2);

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const event = this.eventFormService.getEvent(this.editForm);
    if (event.id !== null) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
