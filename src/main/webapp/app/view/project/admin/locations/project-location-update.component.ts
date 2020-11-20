import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { IProject } from 'app/shared/model/project.model';
import { ILocation, Location } from 'app/shared/model/location.model';

import { LocationService } from 'app/entities/location/location.service';
import { IResponsibility } from 'app/shared/model/responsibility.model';
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
  responsibilities?: IResponsibility[];
  project$ = new Subject<IProject>();
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
            map(response => response.body as IResponsibility[]),
            filter<IResponsibility[]>(Boolean)
          )
        )
      )
      .subscribe(responsibilities => (this.responsibilities = responsibilities));
  }

  public updateForm(project: IProject, location: ILocation): void {
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

  private createFromForm(): ILocation {
    return {
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
