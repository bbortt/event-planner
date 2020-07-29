import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IInvitation, Invitation } from 'app/shared/model/invitation.model';
import { InvitationService } from './invitation.service';
import { IProject } from 'app/shared/model/project.model';
import { ProjectService } from 'app/entities/project/project.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IRole } from 'app/shared/model/role.model';
import { RoleService } from 'app/entities/role/role.service';
import { IResponsibility } from 'app/shared/model/responsibility.model';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

type SelectableEntity = IProject | IUser | IRole | IResponsibility;

@Component({
  selector: 'jhi-invitation-update',
  templateUrl: './invitation-update.component.html',
})
export class InvitationUpdateComponent implements OnInit {
  isSaving = false;
  projects: IProject[] = [];
  users: IUser[] = [];
  roles: IRole[] = [];
  responsibilities: IResponsibility[] = [];

  editForm = this.fb.group({
    id: [],
    email: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    accepted: [null, [Validators.required]],
    project: [null, Validators.required],
    user: [],
    role: [null, Validators.required],
    responsibility: [],
  });

  constructor(
    protected invitationService: InvitationService,
    protected projectService: ProjectService,
    protected userService: UserService,
    protected roleService: RoleService,
    protected responsibilityService: ResponsibilityService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invitation }) => {
      this.updateForm(invitation);

      this.projectService.query().subscribe((res: HttpResponse<IProject[]>) => (this.projects = res.body || []));

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));

      this.roleService.query().subscribe((res: HttpResponse<IRole[]>) => (this.roles = res.body || []));

      this.responsibilityService.query().subscribe((res: HttpResponse<IResponsibility[]>) => (this.responsibilities = res.body || []));
    });
  }

  updateForm(invitation: IInvitation): void {
    this.editForm.patchValue({
      id: invitation.id,
      email: invitation.email,
      accepted: invitation.accepted,
      project: invitation.project,
      user: invitation.user,
      role: invitation.role,
      responsibility: invitation.responsibility,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const invitation = this.createFromForm();
    if (invitation.id !== undefined) {
      this.subscribeToSaveResponse(this.invitationService.update(invitation));
    } else {
      this.subscribeToSaveResponse(this.invitationService.create(invitation));
    }
  }

  private createFromForm(): IInvitation {
    return {
      ...new Invitation(),
      id: this.editForm.get(['id'])!.value,
      email: this.editForm.get(['email'])!.value,
      accepted: this.editForm.get(['accepted'])!.value,
      project: this.editForm.get(['project'])!.value,
      user: this.editForm.get(['user'])!.value,
      role: this.editForm.get(['role'])!.value,
      responsibility: this.editForm.get(['responsibility'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvitation>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    if (item['id']) {
      return item['id'];
    }

    return (item as IRole).name;
  }
}
