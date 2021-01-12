import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { Invitation } from 'app/shared/model/invitation.model';
import { InvitationService } from 'app/entities/invitation/invitation.service';

@Component({
  templateUrl: './project-user-invite-delete-dialog.component.html',
})
export class ProjectUserInviteDeleteDialogComponent {
  private _invitation?: Invitation;

  constructor(
    protected invitationService: InvitationService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  set invitation(invitation: Invitation) {
    this._invitation = invitation;
  }

  get invitation(): Invitation {
    return this._invitation!;
  }

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
