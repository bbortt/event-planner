import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EventManager } from 'app/core/util/event-manager.service';

import { InvitationService } from 'app/entities/invitation/invitation.service';

import { Invitation } from 'app/entities/invitation/invitation.model';

@Component({
  templateUrl: './project-user-invite-delete-dialog.component.html',
})
export class ProjectUserInviteDeleteDialogComponent {
  invitation?: Invitation;

  constructor(private invitationService: InvitationService, private activeModal: NgbActiveModal, private eventManager: EventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.invitationService.delete(id).subscribe(() => {
      this.eventManager.broadcast('invitationListModification');
      this.activeModal.close();
    });
  }
}
