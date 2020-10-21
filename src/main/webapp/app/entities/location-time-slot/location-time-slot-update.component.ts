import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ILocationTimeSlot, LocationTimeSlot } from 'app/shared/model/location-time-slot.model';
import { LocationTimeSlotService } from './location-time-slot.service';
import { ILocation } from 'app/shared/model/location.model';
import { LocationService } from 'app/entities/location/location.service';

@Component({
  selector: 'jhi-location-time-slot-update',
  templateUrl: './location-time-slot-update.component.html',
})
export class LocationTimeSlotUpdateComponent implements OnInit {
  isSaving = false;
  locations: ILocation[] = [];

  editForm = this.fb.group({
    id: [],
    startTime: [null, [Validators.required]],
    endTime: [null, [Validators.required]],
    location: [null, Validators.required],
  });

  constructor(
    protected locationTimeSlotService: LocationTimeSlotService,
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ locationTimeSlot }) => {
      if (!locationTimeSlot.id) {
        const today = moment().startOf('day');
        locationTimeSlot.startTime = today;
        locationTimeSlot.endTime = today;
      }

      this.updateForm(locationTimeSlot);

      this.locationService.query().subscribe((res: HttpResponse<ILocation[]>) => (this.locations = res.body || []));
    });
  }

  updateForm(locationTimeSlot: ILocationTimeSlot): void {
    this.editForm.patchValue({
      id: locationTimeSlot.id,
      startTime: locationTimeSlot.startTime ? locationTimeSlot.startTime.format(DATE_TIME_FORMAT) : null,
      endTime: locationTimeSlot.endTime ? locationTimeSlot.endTime.format(DATE_TIME_FORMAT) : null,
      location: locationTimeSlot.location,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const locationTimeSlot = this.createFromForm();
    if (locationTimeSlot.id !== undefined) {
      this.subscribeToSaveResponse(this.locationTimeSlotService.update(locationTimeSlot));
    } else {
      this.subscribeToSaveResponse(this.locationTimeSlotService.create(locationTimeSlot));
    }
  }

  private createFromForm(): ILocationTimeSlot {
    return {
      ...new LocationTimeSlot(),
      id: this.editForm.get(['id'])!.value,
      startTime: this.editForm.get(['startTime'])!.value ? moment(this.editForm.get(['startTime'])!.value, DATE_TIME_FORMAT) : undefined,
      endTime: this.editForm.get(['endTime'])!.value ? moment(this.editForm.get(['endTime'])!.value, DATE_TIME_FORMAT) : undefined,
      location: this.editForm.get(['location'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocationTimeSlot>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: ILocation): any {
    return item.id;
  }
}
