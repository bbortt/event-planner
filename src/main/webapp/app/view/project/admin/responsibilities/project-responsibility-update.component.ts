import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { IProject } from 'app/shared/model/project.model';
import { IResponsibility, Responsibility } from 'app/shared/model/responsibility.model';

import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

@Component({
  selector: 'app-responsibility-update',
  templateUrl: './project-responsibility-update.component.html',
  styleUrls: ['./project-responsibility-update.component.scss'],
})
export class ProjectResponsibilityUpdateComponent {
  isSaving = false;

  isNew = false;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    project: [],
  });

  constructor(protected responsibilityService: ResponsibilityService, private fb: FormBuilder) {}

  public updateForm(project: IProject, responsibility: IResponsibility): void {
    this.isNew = !responsibility.id;
    this.editForm.patchValue({
      id: responsibility.id,
      name: responsibility.name,
      project,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const responsibility = this.createFromForm();
    if (responsibility.id !== undefined) {
      this.subscribeToSaveResponse(this.responsibilityService.update(responsibility));
    } else {
      this.subscribeToSaveResponse(this.responsibilityService.create(responsibility));
    }
  }

  private createFromForm(): IResponsibility {
    return {
      ...new Responsibility(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      project: this.editForm.get(['project'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResponsibility>>): void {
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

  trackById(index: number, item: IProject): any {
    return item.id;
  }
}
