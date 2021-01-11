import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { JhiEventManager } from 'ng-jhipster';

import { InvitationService } from 'app/entities/invitation/invitation.service';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { Invitation } from 'app/shared/model/invitation.model';
import { Project } from 'app/shared/model/project.model';
import { Responsibility } from 'app/shared/model/responsibility.model';

import { CONTRIBUTOR, InternalRole, ROLES } from 'app/shared/constants/role.constants';

@Component({
  selector: 'app-project-user-invite',
  templateUrl: './project-user-invite.component.html',
  styleUrls: ['project-user-invite.component.scss'],
})
export class ProjectUserInviteComponent {
  isSaving = false;
  isNew = false;
  inviteForm = this.fb.group({
    id: [],
    email: [null, [Validators.required, Validators.email]],
    role: [CONTRIBUTOR, [Validators.required]],
    responsibility: [null],
    responsibilityAutocomplete: [],
  });

  ROLES = ROLES;

  private project?: Project;
  responsibilities: Responsibility[] = [];

  constructor(
    private invitationService: InvitationService,
    private fb: FormBuilder,
    private eventManager: JhiEventManager,
    private responsibilityService: ResponsibilityService
  ) {}

  public save(): void {
    this.isSaving = false;
    const invitation: Invitation = {
      id: this.inviteForm.get('id')!.value,
      email: this.inviteForm.get('email')!.value,
      accepted: false,
      project: this.project!,
      responsibility: this.inviteForm.get('responsibility')!.value,
      role: {
        name: (this.inviteForm.get('role')!.value as InternalRole).name,
      },
    };
    if (invitation.id) {
      this.invitationService.update(invitation).subscribe(() => {
        this.eventManager.broadcast('invitationListModification');
        this.previousState();
      });
    } else {
      this.invitationService.create(invitation).subscribe(() => {
        this.eventManager.broadcast('invitationListModification');
        this.previousState();
      });
    }
  }

  public updateForm(project: Project, invitation: Invitation): void {
    this.isNew = !invitation.id;
    this.project = project;
    this.inviteForm.patchValue({
      id: invitation.id,
      email: invitation.email,
      role: ROLES.find(role => role.name === invitation?.role?.name) || null,
      responsibility: invitation.responsibility,
      responsibilityAutocomplete: invitation.responsibility?.name,
    });
    this.responsibilityService.findAllByProject(project).subscribe(responsibilities => {
      this.responsibilities = responsibilities.body || [];
    });
  }

  responsibilitySelected($event: any): void {
    this.inviteForm.get('responsibility')!.setValue($event.selectedItem);
  }

  public previousState(): void {
    window.history.back();
  }
}
