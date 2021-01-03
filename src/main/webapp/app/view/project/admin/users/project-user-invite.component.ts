import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InvitationService } from 'app/entities/invitation/invitation.service';
import { Invitation } from 'app/shared/model/invitation.model';
import { Project } from 'app/shared/model/project.model';
import { JhiEventManager } from 'ng-jhipster';
import { CONTRIBUTOR, InternalRole, ROLES } from 'app/shared/constants/role.constants';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

@Component({
  selector: 'app-project-user-invite',
  templateUrl: './project-user-invite.component.html',
  styleUrls: ['project-user-invite.component.scss'],
})
export class ProjectUserInviteComponent {
  isSaving = false;
  inviteForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    role: [CONTRIBUTOR, [Validators.required]],
    responsibility: [null],
  });
  ROLES = ROLES;
  responsibilities: Responsibility[] = [];

  private project?: Project;

  constructor(
    private invitationService: InvitationService,
    private fb: FormBuilder,
    private eventManager: JhiEventManager,
    private responsibilityService: ResponsibilityService
  ) {}

  public save(): void {
    this.isSaving = false;
    const invitation: Invitation = {
      email: this.inviteForm.get('email')!.value,
      accepted: false,
      project: this.project!,
      responsibility: this.inviteForm.get('responsibility')!.value,
      role: {
        name: (this.inviteForm.get('role')!.value as InternalRole).name,
      },
    };
    this.invitationService.create(invitation).subscribe(() => {
      this.eventManager.broadcast('invitationListModification');
      this.previousState();
    });
  }

  public setProject(project: Project): void {
    this.project = project;
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
