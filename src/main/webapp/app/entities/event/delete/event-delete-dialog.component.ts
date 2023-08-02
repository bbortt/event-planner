import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

import SharedModule from 'app/shared/shared.module';

import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';

@Component({
  standalone: true,
  templateUrl: './event-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export default class EventDeleteDialogComponent {
  event?: IEvent;

  constructor(protected eventService: EventService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
