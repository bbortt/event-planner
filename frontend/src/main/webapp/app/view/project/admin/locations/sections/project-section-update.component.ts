import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { JhiEventManager } from 'ng-jhipster';

import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';
import { SectionService } from 'app/entities/section/section.service';
import { UserService } from 'app/core/user/user.service';

import { Location } from 'app/shared/model/location.model';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { Section } from 'app/shared/model/section.model';
import { User } from 'app/core/user/user.model';

import { uniquePropertyValueInLocationValidator } from 'app/entities/validator/unique-property-value-in-location.validator';

import responsibilityOrUserFromForm from 'app/shared/util/responsibility-or-user-from-form';

@Component({
  selector: 'app-section-update',
  templateUrl: './project-section-update.component.html',
  styleUrls: ['./project-section-update.component.scss'],
})
export class ProjectSectionUpdateComponent implements OnInit {
  isSaving = false;
  isNew = false;
  isResponsibility = false;

  responsibilities: Responsibility[] = [];
  users: User[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    responsibility: [],
    responsibilityAutocomplete: [],
    user: [],
    userAutocomplete: [],
    location: [],
  });

  constructor(
    protected sectionService: SectionService,
    private eventManager: JhiEventManager,
    private fb: FormBuilder,
    private responsibilityService: ResponsibilityService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  public updateForm(location: Location, section: Section): void {
    this.isNew = !section.id;
    this.isResponsibility = !section.user;

    this.responsibilityService
      .findAllByProject(location.project, { sort: ['name,asc'] })
      .subscribe((response: HttpResponse<Responsibility[]>) => (this.responsibilities = response.body || []));

    this.userService
      .findAllByProject(location.project, { sort: ['email,asc'] })
      .subscribe((response: HttpResponse<User[]>) => (this.users = response.body || []));

    this.editForm.patchValue({
      id: section.id,
      name: section.name,
      responsibility: section.responsibility,
      responsibilityAutocomplete: section.responsibility?.name,
      user: section.user,
      userAutocomplete: section.user?.email,
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

  userSelected($event: any): void {
    this.editForm.get('user')!.setValue($event.selectedItem);
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

  private createFromForm(): Section {
    const { responsibility, user } = responsibilityOrUserFromForm(this.editForm, this.isResponsibility);

    return {
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      responsibility,
      user,
      location: this.editForm.get(['location'])!.value,
    };
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
}
