import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { JhiEventManager } from 'ng-jhipster';

import { Project } from 'app/shared/model/project.model';
import { Location } from 'app/shared/model/location.model';

import { LocationService } from 'app/entities/location/location.service';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

@Component({
  selector: 'app-location-update',
  templateUrl: './project-location-update.component.html',
  styleUrls: ['./project-location-update.component.scss'],
})
export class ProjectLocationUpdateComponent {
  isNew = false;
  isSaving = false;

  project?: Project;

  responsibilities: Responsibility[] = [];
  filteredResponsibilities: Responsibility[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    responsibility: [null, [Validators.required]],
    project: [],
  });

  constructor(
    protected locationService: LocationService,
    private eventManager: JhiEventManager,
    private fb: FormBuilder,
    private responsibilityService: ResponsibilityService
  ) {}

  public updateForm(project: Project, location: Location): void {
    this.isNew = !location.id;
    this.responsibilityService.findAllByProject(project).subscribe(responsibilities => {
      this.responsibilities = responsibilities.body || [];
      this.filteredResponsibilities = this.responsibilities;
    });

    this.editForm.patchValue({
      id: location.id,
      name: location.name,
      responsibility: location.responsibility,
      project,
    });
  }

  public filter(searchString: string): void {
    this.filteredResponsibilities = this.responsibilities.filter(responsibility =>
      responsibility.name!.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  private initialLoad(): void {
    this.filteredResponsibilities = this.responsibilities;
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
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      responsibility: this.editForm.get(['responsibility'])!.value,
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
    this.eventManager.broadcast('locationListModification');
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
