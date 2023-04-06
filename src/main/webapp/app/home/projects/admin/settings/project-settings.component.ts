import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IProject } from 'app/entities/project/project.model';
import { EventManager, EventWithContent } from '../../../../core/util/event-manager.service';

import { ProjectFormGroup, ProjectFormService } from '../../../../entities/project/update/project-form.service';
import { ProjectService } from '../../../../entities/project/service/project.service';

@Component({
  selector: 'jhi-project-update',
  templateUrl: './project-settings.component.html',
})
export class ProjectSettingsComponent implements OnInit {
  isSaving = false;
  project: IProject | null = null;
  isProjectArchived = false;

  editForm: ProjectFormGroup;

  constructor(
    private eventManager: EventManager,
    protected projectService: ProjectService,
    protected projectFormService: ProjectFormService,
    protected activatedRoute: ActivatedRoute
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
    window.history.back();
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
    this.eventManager.broadcast(new EventWithContent('error.unknown', httpErrorResponse));
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
