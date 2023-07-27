import { Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { ProjectFormGroup, ProjectFormService } from 'app/entities/project/update/project-form.service';

import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export default class ProjectSettingsComponent implements OnInit {
  isSaving = false;
  project: IProject | null = null;
  isProjectArchived = false;

  editForm: ProjectFormGroup;

  constructor(
    private eventManager: EventManager,
    private location: Location,
    protected projectService: ProjectService,
    protected projectFormService: ProjectFormService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.editForm = this.projectFormService.createProjectFormGroup();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
      if (project) {
        this.updateForm(project);
        this.isProjectArchived = project.archived;

        if (this.isProjectArchived) {
          this.editForm.disable();
        } else if (project.id) {
          this.disableInformativeFields();
        }
      }
    });
  }

  previousState(): void {
    this.location.back();
  }

  save(): void {
    this.isSaving = true;
    const project = this.projectFormService.getProject(this.editForm);
    if (project.id !== null) {
      this.subscribeToSaveResponse(this.projectService.update(project));
    } else {
      this.subscribeToSaveResponse(this.projectService.create(project));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProject>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: response => this.onSaveError(response),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(httpErrorResponse: HttpErrorResponse): void {
    this.eventManager.broadcast(new EventWithContent('app.httpError', httpErrorResponse));
    this.previousState();
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(project: IProject): void {
    this.project = project;
    this.projectFormService.resetForm(this.editForm, this.project);
  }

  private disableInformativeFields(): void {
    this.editForm.controls.id.disable();
    this.editForm.controls.token.disable();
    this.editForm.controls.startDate.disable();
    this.editForm.controls.endDate.disable();
  }
}
