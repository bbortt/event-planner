import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { Project } from 'app/shared/model/project.model';
import { Location } from 'app/shared/model/location.model';

import { LocationService } from 'app/entities/location/location.service';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-location-update',
  templateUrl: './project-location-update.component.html',
  styleUrls: ['./project-location-update.component.scss'],
})
export class ProjectLocationUpdateComponent {
  isSaving = false;
  isNew = false;
  responsibilities?: Responsibility[];
  project$ = new Subject<Project>();
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    project: [],
  });

  constructor(protected locationService: LocationService, private fb: FormBuilder, private responsibilityService: ResponsibilityService) {
    this.project$
      .pipe(
        switchMap(project =>
          this.responsibilityService.findAllByProject(project).pipe(
            map(response => response.body as Responsibility[]),
            filter<Responsibility[]>(Boolean)
          )
        )
      )
      .subscribe(responsibilities => (this.responsibilities = responsibilities));
  }

  public updateForm(project: Project, location: Location): void {
    this.isNew = !location.id;
    this.project$.next(project);
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

  private createFromForm(): Location {
    return {
      ...new Location(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      project: this.editForm.get(['project'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Location>>): void {
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

  trackById(index: number, item: Project): any {
    return item.id;
  }
}
