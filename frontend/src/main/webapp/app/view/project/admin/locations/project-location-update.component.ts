import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { EventManager } from 'app/core/util/event-manager.service';

import { LocationService } from 'app/entities/location/location.service';
import { ProjectService } from 'app/entities/project/project.service';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';
import { UserService } from 'app/entities/user/user.service';

import { Location } from 'app/entities/location/location.model';
import { Project } from 'app/entities/project/project.model';
import { Responsibility } from 'app/entities/responsibility/responsibility.model';
import { User } from 'app/entities/user/user.model';

import { Account } from 'app/core/auth/account.model';

import { uniquePropertyValueInProjectValidator } from 'app/entities/validator/unique-property-value-in-project.validator';

import responsibilityOrUserFromForm from 'app/shared/util/responsibility-or-user-from-form';

@Component({
  selector: 'app-location-update',
  templateUrl: './project-location-update.component.html',
  styleUrls: ['./project-location-update.component.scss'],
})
export class ProjectLocationUpdateComponent {
  isNew = false;
  isSaving = false;
  isResponsibility = false;

  project?: Project;

  responsibilities: Responsibility[] = [];
  users: Account[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    responsibility: [],
    responsibilityAutocomplete: [],
    jhiUserId: [],
    userAutocomplete: [],
    project: [],
  });

  constructor(
    protected locationService: LocationService,
    private eventManager: EventManager,
    private fb: FormBuilder,
    private responsibilityService: ResponsibilityService,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  updateForm(project: Project, location: Location): void {
    this.isNew = !location.id;

    const { id, name, responsibility, jhiUserId } = location;

    this.responsibilityService
      .findAllByProject(project, { sort: ['name,asc'] })
      .subscribe((response: HttpResponse<Responsibility[]>) => (this.responsibilities = response.body ?? []));

    this.projectService.getAllUsers(project).subscribe((users: Account[]) => (this.users = users));

    this.isResponsibility = !jhiUserId;

    (jhiUserId ? this.userService.find(jhiUserId) : of({ body: {} } as HttpResponse<User>)).subscribe((response: HttpResponse<User>) =>
      this.editForm.patchValue({
        id,
        name,
        responsibility,
        responsibilityAutocomplete: responsibility?.name,
        jhiUserId,
        userAutocomplete: response.body?.email,
        project,
      })
    );

    this.editForm
      .get('name')
      ?.valueChanges.pipe(take(1))
      .subscribe((newValue: string) =>
        this.editForm.setControl(
          'name',
          new FormControl(
            newValue,
            [Validators.required, Validators.maxLength(50)],
            [uniquePropertyValueInProjectValidator(project, (p: Project, v: string) => this.locationService.nameExistsInProject(p, v))]
          )
        )
      );
  }

  responsibilitySelected($event: any): void {
    this.editForm.get('responsibility')!.setValue($event.selectedItem);
  }

  userSelected($event: { selectedItem: User }): void {
    this.editForm.get('jhiUserId')!.setValue($event.selectedItem.id);
  }

  onRadioChange($event: any): void {
    this.isResponsibility = $event.target.defaultValue === 'responsibility';
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

  private createFromForm(): Location {
    const { responsibility, jhiUserId } = responsibilityOrUserFromForm(this.editForm, this.isResponsibility);

    return {
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      responsibility,
      jhiUserId,
      project: this.editForm.get(['project'])!.value,
    };
  }
}
