import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { JhiEventManager } from 'ng-jhipster';

import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { Project } from 'app/shared/model/project.model';
import { Responsibility } from 'app/shared/model/responsibility.model';

import { uniquePropertyValueInProjectValidator } from 'app/entities/validator/unique-property-value-in-project.validator';

import { DEFAULT_SCHEDULER_COLOR } from 'app/app.constants';

@Component({
  selector: 'app-responsibility-update',
  templateUrl: './project-responsibility-update.component.html',
  styleUrls: ['./project-responsibility-update.component.scss'],
})
export class ProjectResponsibilityUpdateComponent {
  isNew = false;
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    color: [DEFAULT_SCHEDULER_COLOR, [Validators.required, Validators.minLength(3), Validators.maxLength(23)]],
    project: [],
  });

  constructor(protected responsibilityService: ResponsibilityService, private eventManager: JhiEventManager, private fb: FormBuilder) {}

  public updateForm(project: Project, responsibility: Responsibility): void {
    this.isNew = !responsibility.id;

    this.editForm.patchValue({
      id: responsibility.id,
      name: responsibility.name,
      color: responsibility.color ? responsibility.color : DEFAULT_SCHEDULER_COLOR,
      project,
    });

    this.editForm
      .get('name')
      ?.valueChanges.pipe(take(1))
      .subscribe((newValue: string) =>
        this.editForm.setControl(
          'name',
          new FormControl(
            newValue,
            [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
            [
              uniquePropertyValueInProjectValidator(project, (p: Project, v: string) =>
                this.responsibilityService.nameExistsInProject(p, v)
              ),
            ]
          )
        )
      );
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

  private createFromForm(): Responsibility {
    return {
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      color: this.editForm.get(['color'])!.value,
      project: this.editForm.get(['project'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Responsibility>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.eventManager.broadcast('responsibilityListModification');
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: Project): any {
    return item.id;
  }
}
