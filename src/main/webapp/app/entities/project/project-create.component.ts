import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IProject } from 'app/shared/model/project.model';
import { ProjectService } from './project.service';
import { IUser } from '../../core/user/user.model';
import { AccountService } from '../../core/auth/account.service';
import { CreateProject, ICreateProject } from '../../shared/model/dto/create-project.model';

@Component({
  selector: 'jhi-project-create',
  templateUrl: './project-create.component.html',
})
export class ProjectCreateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    description: [null, [Validators.minLength(1), Validators.maxLength(300)]],
    startTime: [null, [Validators.required]],
    endTime: [null, [Validators.required]],
  });
  selectedUser?: IUser;

  constructor(
    private projectService: ProjectService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      const today = moment().startOf('day');
      project.startTime = today;
      project.endTime = today;
    });
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

    if (this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
      newProject.user = this.selectedUser;
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

  userSelected(user: IUser): void {
    this.selectedUser = user;
  }
}
