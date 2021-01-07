import { Component, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { JhiEventManager } from 'ng-jhipster';

import { DxAutocompleteComponent } from 'devextreme-angular';

import { LocationService } from 'app/entities/location/location.service';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';
import { UserService } from 'app/core/user/user.service';

import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { User } from 'app/core/user/user.model';

@Component({
  selector: 'app-location-update',
  templateUrl: './project-location-update.component.html',
  styleUrls: ['./project-location-update.component.scss'],
})
export class ProjectLocationUpdateComponent {
  @ViewChild(DxAutocompleteComponent, { static: true })
  autocomplete?: DxAutocompleteComponent;

  isNew = false;
  isSaving = false;
  isResponsibility = true;
  isUser = false;

  project?: Project;

  responsibilities: Responsibility[] = [];
  users: User[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    responsibility: [],
    responsibilityAutocomplete: [],
    user: [],
    userAutocomplete: [],
    project: [],
  });

  constructor(
    protected locationService: LocationService,
    private eventManager: JhiEventManager,
    private fb: FormBuilder,
    private responsibilityService: ResponsibilityService,
    private userService: UserService
  ) {}

  public updateForm(project: Project, location: Location): void {
    this.isNew = !location.id;
    this.responsibilityService.findAllByProject(project, { sort: ['name,asc'] }).subscribe(responsibilities => {
      this.responsibilities = responsibilities.body || [];
    });

    this.userService.findAllByProject(project, { sort: ['login,asc'] }).subscribe(users => {
      this.users = users.body || [];
    });

    this.editForm.patchValue({
      id: location.id,
      name: location.name,
      responsibility: location.responsibility,
      responsibilityAutocomplete: location.responsibility?.name,
      user: location.user,
      userAutocomplete: location.user?.login,
      project,
    });
  }

  responsibilitySelected($event: any): void {
    this.editForm.get('responsibility')!.setValue($event.selectedItem);
  }

  userSelected($event: any): void {
    this.editForm.get('user')!.setValue($event.selectedItem);
  }

  onRadioChange($event: any): void {
    // eslint-disable-next-line no-console
    console.log($event.target.defaultValue);
    if ($event.target.defaultValue === 'responsibility') {
      this.isResponsibility = true;
      this.isUser = false;
    } else {
      this.isResponsibility = false;
      this.isUser = true;
    }
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
      user: this.editForm.get(['user'])!.value,
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
