import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILocationTimeSlot } from 'app/shared/model/location-time-slot.model';

@Component({
  selector: 'jhi-location-time-slot-detail',
  templateUrl: './location-time-slot-detail.component.html',
})
export class LocationTimeSlotDetailComponent implements OnInit {
  locationTimeSlot: ILocationTimeSlot | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ locationTimeSlot }) => (this.locationTimeSlot = locationTimeSlot));
  }

  previousState(): void {
    window.history.back();
  }
}
