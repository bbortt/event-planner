import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InvitationService } from 'app/entities/invitation/invitation.service';
import { Invitation } from 'app/shared/model/invitation.model';
import { Project } from 'app/shared/model/project.model';
import { JhiEventManager } from 'ng-jhipster';
import { CONTRIBUTOR, InternalRole, ROLES } from 'app/shared/constants/role.constants';

@Component({
  selector: 'app-project-user-invite',
  templateUrl: './project-user-invite.component.html',
  styleUrls: ['project-user-invite.component.scss'],
})
export class ProjectUserInviteComponent {
  public isSaving = false;
  public inviteform = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    role: [CONTRIBUTOR, [Validators.required]],
  });
  public ROLES = ROLES;

  private project?: Project;

  constructor(private invitationService: InvitationService, private fb: FormBuilder, private eventManager: JhiEventManager) {}

  public save(): void {
    this.isSaving = false;
    const invitation: Invitation = {
      email: this.inviteform.get('email')!.value,
      accepted: false,
      project: this.project!,
      role: {
        name: (this.inviteform.get('role')!.value as InternalRole).name,
      },
    };
    this.invitationService.create(invitation).subscribe(() => {
      this.eventManager.broadcast('invitationListModification');
      this.previousState();
    });
  }

  public setProject(project: Project): void {
    this.project = project;
  }

  public previousState(): void {
    window.history.back();
  }

  public isDisplayingError(path: string): boolean {
    return (this.inviteform.get(path)!.invalid && this.inviteform.get(path)!.dirty) || this.inviteform.get(path)!.touched;
  }
}
