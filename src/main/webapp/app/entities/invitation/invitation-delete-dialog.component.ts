import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IInvitation } from 'app/shared/model/invitation.model';
import { InvitationService } from './invitation.service';

@Component({
  templateUrl: './invitation-delete-dialog.component.html',
})
export class InvitationDeleteDialogComponent {
  invitation?: IInvitation;

  constructor(
    protected invitationService: InvitationService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

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
