import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { EventManager } from 'app/core/util/event-manager.service';

import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';
import { ProjectService } from 'app/entities/project/project.service';
import { SectionService } from 'app/entities/section/section.service';

import { Location } from 'app/entities/location/location.model';
import { Responsibility } from 'app/entities/responsibility/responsibility.model';
import { Section } from 'app/entities/section/section.model';
import { User } from 'app/entities/user/user.model';

import { Account } from 'app/core/auth/account.model';

import { uniquePropertyValueInLocationValidator } from 'app/entities/validator/unique-property-value-in-location.validator';

import responsibilityOrUserFromForm from 'app/shared/util/responsibility-or-user-from-form';

@Component({
  selector: 'app-section-update',
  templateUrl: './project-section-update.component.html',
  styleUrls: ['./project-section-update.component.scss'],
})
export class ProjectSectionUpdateComponent {
  isSaving = false;
  isNew = false;
  isResponsibility = false;

  responsibilities: Responsibility[] = [];
  users: Account[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    responsibility: [],
    responsibilityAutocomplete: [],
    jhiUserId: [],
    userAutocomplete: [],
    location: [],
  });

  constructor(
    protected sectionService: SectionService,
    private eventManager: EventManager,
    private fb: FormBuilder,
    private responsibilityService: ResponsibilityService,
    private projectService: ProjectService
  ) {}

  updateForm(location: Location, section: Section): void {
    this.isNew = !section.id;

    const { id, name, responsibility, user } = section;

    this.responsibilityService
      .findAllByProject(location.project, { sort: ['name,asc'] })
      .subscribe((response: HttpResponse<Responsibility[]>) => (this.responsibilities = response.body ?? []));

    this.projectService.getAllUsers(location.project).subscribe((users: Account[]) => (this.users = users));

    this.isResponsibility = !user;

    this.editForm.patchValue({
      id,
      name,
      responsibility,
      responsibilityAutocomplete: section.responsibility?.name,
      user,
      userAutocomplete: user?.email,
      location,
    });

    this.editForm
      .get('name')
      ?.valueChanges.pipe(take(1))
      .subscribe((newValue: string) =>
        this.editForm.setControl(
          'name',
          new FormControl(
            newValue,
            [Validators.required, Validators.maxLength(50)],
            [uniquePropertyValueInLocationValidator(location, (l: Location, v: string) => this.sectionService.nameExistsInLocation(l, v))]
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
    const section = this.createFromForm();
    if (section.id) {
      this.subscribeToSaveResponse(this.sectionService.update(section));
    } else {
      this.subscribeToSaveResponse(this.sectionService.create(section));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Section>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.eventManager.broadcast('sectionListModification');
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  private createFromForm(): Section {
    const { responsibility, user } = responsibilityOrUserFromForm(this.editForm, this.isResponsibility);

    return {
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      location: this.editForm.get(['location'])!.value,
      responsibility,
      user,
    };
  }
}
