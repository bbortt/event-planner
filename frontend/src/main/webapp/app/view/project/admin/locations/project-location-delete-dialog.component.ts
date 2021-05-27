import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EventManager } from 'app/core/util/event-manager.service';

import { LocationService } from 'app/entities/location/location.service';

import { Location } from 'app/entities/location/location.model';

@Component({
  templateUrl: './project-location-delete-dialog.component.html',
})
export class ProjectLocationDeleteDialogComponent {
  location?: Location;

  constructor(private locationService: LocationService, private activeModal: NgbActiveModal, private eventManager: EventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.locationService.delete(id).subscribe(() => {
      this.eventManager.broadcast('locationListModification');
      this.activeModal.close();
    });
  }
}
