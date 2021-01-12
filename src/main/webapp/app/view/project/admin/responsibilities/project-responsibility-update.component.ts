import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { JhiEventManager } from 'ng-jhipster';

import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { Project } from 'app/shared/model/project.model';
import { Responsibility } from 'app/shared/model/responsibility.model';

import { ResponsibilityUniqueNameValidator } from 'app/entities/responsibility/responsibility-unique-name.validator';

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
    project: [],
  });

  constructor(
    protected responsibilityService: ResponsibilityService,
    private uniqueValidator: ResponsibilityUniqueNameValidator,
    private eventManager: JhiEventManager,
    private fb: FormBuilder
  ) {}

  public updateForm(project: Project, responsibility: Responsibility): void {
    this.isNew = !responsibility.id;

    this.editForm.patchValue({
      id: responsibility.id,
      name: responsibility.name,
      project,
    });

    this.editForm.setControl(
      'name',
      new FormControl(
        responsibility.name,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
        [this.uniqueValidator.validate(project)]
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
