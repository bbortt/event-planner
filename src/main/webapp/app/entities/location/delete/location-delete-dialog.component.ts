import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

import SharedModule from 'app/shared/shared.module';

import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

@Component({
  standalone: true,
  templateUrl: './location-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export default class LocationDeleteDialogComponent {
  location?: ILocation;

  constructor(protected locationService: LocationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.locationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
