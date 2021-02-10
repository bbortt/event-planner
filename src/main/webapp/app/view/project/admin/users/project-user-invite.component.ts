import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { take } from 'rxjs/operators';

import { JhiEventManager } from 'ng-jhipster';

import { InvitationService } from 'app/entities/invitation/invitation.service';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { Invitation } from 'app/shared/model/invitation.model';
import { Project } from 'app/shared/model/project.model';
import { Responsibility } from 'app/shared/model/responsibility.model';

import { uniquePropertyValueInProjectValidator } from 'app/entities/validator/unique-property-value-in-project.validator';

import { DEFAULT_SCHEDULER_COLOR } from 'app/app.constants';
import { ADMIN, CONTRIBUTOR, InternalRole, ROLES, SECRETARY, VIEWER } from 'app/shared/constants/role.constants';

@Component({
  selector: 'app-project-user-invite',
  templateUrl: './project-user-invite.component.html',
  styleUrls: ['project-user-invite.component.scss'],
})
export class ProjectUserInviteComponent {
  isSaving = false;
  isNew = false;

  editForm = this.fb.group({
    id: [],
    email: [null, [Validators.required, Validators.email]],
    token: [null],
    accepted: [false],
    color: [DEFAULT_SCHEDULER_COLOR, [Validators.required, Validators.minLength(3), Validators.maxLength(23)]],
    role: [CONTRIBUTOR, [Validators.required]],
    responsibility: [null],
    responsibilityAutocomplete: [],
  });

  roleProjectAdmin = ADMIN;
  invitationRoles = [SECRETARY, CONTRIBUTOR, VIEWER];

  private project?: Project;
  responsibilities: Responsibility[] = [];

  constructor(
    private invitationService: InvitationService,
    private fb: FormBuilder,
    private eventManager: JhiEventManager,
    private responsibilityService: ResponsibilityService
  ) {}

  public updateForm(project: Project, invitation: Invitation): void {
    this.isNew = !invitation.id;
    this.project = project;

    this.responsibilityService.findAllByProject(project).subscribe(responsibilities => {
      this.responsibilities = responsibilities.body || [];
    });

    this.editForm.patchValue({
      id: invitation.id,
      email: invitation.email,
      accepted: invitation.accepted,
      token: invitation.token,
      color: invitation.color ? invitation.color : DEFAULT_SCHEDULER_COLOR,
      role: ROLES.find(role => role.name === invitation?.role?.name) || null,
      responsibility: invitation.responsibility,
      responsibilityAutocomplete: invitation.responsibility?.name,
    });

    this.editForm
      .get('email')
      ?.valueChanges.pipe(take(1))
      .subscribe((newValue: string) =>
        this.editForm.setControl(
          'email',
          new FormControl(
            newValue,
            [Validators.required, Validators.email],
            [uniquePropertyValueInProjectValidator(project, (p: Project, v: string) => this.invitationService.emailExistsInProject(p, v))]
          )
        )
      );
  }

  public save(): void {
    this.isSaving = false;
    const invitation: Invitation = {
      id: this.editForm.get('id')!.value,
      email: this.editForm.get('email')!.value,
      accepted: this.editForm.get('accepted')!.value || false,
      token: this.editForm.get('token')!.value,
      color: this.editForm.get('color')!.value,
      project: this.project!,
      responsibility: this.editForm.get('responsibilityAutocomplete')!.value ? this.editForm.get('responsibility')!.value : null,
      role: {
        name: (this.editForm.get('role')!.value as InternalRole).name,
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

  responsibilitySelected($event: any): void {
    this.editForm.get('responsibility')!.setValue($event.selectedItem);
  }

  public previousState(): void {
    window.history.back();
  }
}
