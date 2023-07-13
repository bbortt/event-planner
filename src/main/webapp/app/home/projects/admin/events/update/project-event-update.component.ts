import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { EventFormService, EventFormGroup } from 'app/entities/event/update/event-form.service';

import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

@Component({
  selector: 'jhi-event-update',
  templateUrl: './project-event-update.component.html',
})
export class ProjectEventUpdateComponent {
  isSaving = false;
  event: IEvent | null = null;

  locationsSharedCollection: ILocation[] = [];

  editForm: EventFormGroup;

  constructor(
    protected eventFormService: EventFormService,
    protected eventService: EventService,
    protected locationService: LocationService,
  ) {
    this.editForm = this.eventFormService.createEventFormGroup();
  }

  public updateForm(event: IEvent): void {
    this.event = event;
    this.eventFormService.resetForm(this.editForm, event);

    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing<ILocation>(
      this.locationsSharedCollection,
      event.location,
    );
  }

  public loadRelationshipsOptions(): void {
    this.locationService
      .query()
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) => this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.event?.location)),
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
