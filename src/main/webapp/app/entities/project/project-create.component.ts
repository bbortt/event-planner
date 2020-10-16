import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IProject } from 'app/shared/model/project.model';
import { ProjectService } from './project.service';
import { IUser } from '../../core/user/user.model';
import { AccountService } from '../../core/auth/account.service';
import { CreateProject, ICreateProject } from '../../shared/model/dto/create-project.model';
import { Authority } from '../../shared/constants/authority.constants';

import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import * as moment from 'moment';

@Component({
  selector: 'jhi-project-create',
  templateUrl: './project-create.component.html',
})
export class ProjectCreateComponent {
  cancelEnabled = true;

  isSaving = false;
  editForm = this.fb.group({
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    description: [null, [Validators.minLength(1), Validators.maxLength(300)]],
    startTime: [null, [Validators.required]],
    endTime: [null, [Validators.required]],
    selectedUser: [null, []],
  });

  constructor(
    private projectService: ProjectService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    if (this.accountService.hasAnyAuthority(Authority.ADMIN)) {
      this.editForm.get(['selectedUser'])!.setValidators(Validators.required);
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const project = this.createFromForm();
    this.subscribeToSaveResponse(this.projectService.create(project));
  }

  private createFromForm(): ICreateProject {
    const newProject = new CreateProject(
      this.editForm.get(['name'])!.value,
      moment(this.editForm.get(['startTime'])!.value, DATE_TIME_FORMAT),
      moment(this.editForm.get(['endTime'])!.value, DATE_TIME_FORMAT),
      this.editForm.get(['description'])!.value
    );

    if (this.accountService.hasAnyAuthority(Authority.ADMIN)) {
      newProject.user = this.editForm.get(['selectedUser'])!.value;
    }

    return newProject;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProject>>): void {
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

  userSelected(selectedUser: IUser): void {
    this.editForm.get(['selectedUser'])!.setValue(selectedUser);
  }
}
