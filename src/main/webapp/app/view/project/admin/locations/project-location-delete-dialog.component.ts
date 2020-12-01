import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Location } from 'app/shared/model/location.model';
import { LocationService } from 'app/entities/location/location.service';

@Component({
  templateUrl: './project-location-delete-dialog.component.html',
})
export class ProjectLocationDeleteDialogComponent {
  location?: Location;

  constructor(
    protected responsibilityService: LocationService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.responsibilityService.delete(id).subscribe(() => {
      this.eventManager.broadcast('locationListModification');
      this.activeModal.close();
    });
  }
}
