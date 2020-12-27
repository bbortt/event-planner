import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { JhiEventManager } from 'ng-jhipster';

import { ProjectService } from 'app/entities/project/project.service';

import { Project } from 'app/shared/model/project.model';

@Component({
  selector: 'app-project-update',
  templateUrl: './project-admin-update.component.html',
  styleUrls: ['./project-admin-update.component.scss'],
})
export class ProjectAdminUpdateComponent {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    description: [null, [Validators.minLength(1), Validators.maxLength(300)]],
    startTime: [],
    endTime: [],
  });

  constructor(protected projectService: ProjectService, private eventManager: JhiEventManager, private fb: FormBuilder) {}

  public updateForm(project: Project): void {
    this.editForm.patchValue({
      id: project.id,
      name: project.name,
      description: project.description,
      startTime: project.startTime,
      endTime: project.endTime,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const project = this.createFromForm();
    this.subscribeToSaveResponse(this.projectService.update(project));
  }

  private createFromForm(): Project {
    return {
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value || null,
      startTime: this.editForm.get(['startTime'])!.value,
      endTime: this.editForm.get(['endTime'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Project>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.eventManager.broadcast('projectDataModification');
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
