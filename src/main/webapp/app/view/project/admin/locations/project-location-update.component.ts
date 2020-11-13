import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { IProject } from 'app/shared/model/project.model';
import { ILocation, Location } from 'app/shared/model/location.model';

import { LocationService } from 'app/entities/location/location.service';

@Component({
  selector: 'app-responsibility-update',
  templateUrl: './project-responsibility-update.component.html',
  styleUrls: ['./project-responsibility-update.component.scss'],
})
export class ProjectLocationUpdateComponent {
  isSaving = false;

  isNew = false;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    project: [],
  });

  constructor(protected locationService: LocationService, private fb: FormBuilder) {}

  public updateForm(project: IProject, location: ILocation): void {
    this.isNew = !location.id;
    this.editForm.patchValue({
      id: location.id,
      name: location.name,
      project,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const location = this.createFromForm();
    if (location.id !== undefined) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  private createFromForm(): ILocation {
    return {
      // Frage, was macht "..."
      ...new Location(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      project: this.editForm.get(['project'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocation>>): void {
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
