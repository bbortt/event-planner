import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ILocationTimeSlot } from 'app/shared/model/location-time-slot.model';
import { LocationTimeSlotService } from './location-time-slot.service';

@Component({
  templateUrl: './location-time-slot-delete-dialog.component.html',
})
export class LocationTimeSlotDeleteDialogComponent {
  locationTimeSlot?: ILocationTimeSlot;

  constructor(
    protected locationTimeSlotService: LocationTimeSlotService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.locationTimeSlotService.delete(id).subscribe(() => {
      this.eventManager.broadcast('locationTimeSlotListModification');
      this.activeModal.close();
    });
  }
}
