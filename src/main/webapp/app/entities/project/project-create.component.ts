import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IProject } from 'app/shared/model/project.model';
import { ProjectService } from './project.service';
import { CreateProject, ICreateProject } from '../../shared/model/dto/create-project.model';

@Component({
  selector: 'jhi-project-create',
  templateUrl: './project-create.component.html',
})
export class ProjectCreateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    description: [null, [Validators.minLength(1), Validators.maxLength(300)]],
    startTime: [null, [Validators.required]],
    endTime: [null, [Validators.required]],
    emailOrLogin: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(254)]],
  });

  constructor(protected projectService: ProjectService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

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
    return {
      ...new CreateProject(
        this.editForm.get(['name'])!.value,
        moment(this.editForm.get(['startTime'])!.value, DATE_TIME_FORMAT),
        moment(this.editForm.get(['endTime'])!.value, DATE_TIME_FORMAT),
        this.editForm.get(['description'])!.value,
        this.editForm.get(['emailOrLogin'])!.value
      ),
    };
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
}
