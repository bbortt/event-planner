import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { JhiEventManager } from 'ng-jhipster';

import { AccountService } from 'app/core/auth/account.service';

import { EventService } from 'app/entities/event/event.service';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';
import { UserService } from 'app/core/user/user.service';

import { Event } from 'app/shared/model/event.model';
import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { Section } from 'app/shared/model/section.model';
import { User } from 'app/core/user/user.model';

import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { AUTHORITY_ADMIN } from 'app/shared/constants/authority.constants';
import { VIEWER } from 'app/shared/constants/role.constants';

import responsibilityOrUserFromForm from 'app/shared/util/responsibility-or-user-from-form';

import * as moment from 'moment';

@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
})
export class EventUpdateComponent implements OnInit, OnDestroy {
  isNew = false;
  isSaving = false;

  isViewer = true;
  isReadonly = true;

  responsibilities: Responsibility[] = [];
  users: User[] = [];

  project?: Project;
  private location?: Location;
  private section?: Section;
  private event?: Event;

  minEndDate = new Date();
  dateTimeFormat = DATE_TIME_FORMAT;

  isResponsibility = false;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    description: [],
    startTime: [new Date(), [Validators.required]],
    endTime: [new Date(), [Validators.required]],
    sections: [null, [Validators.required]],
    responsibility: [],
    responsibilityAutocomplete: [],
    user: [],
    userAutocomplete: [],
  });

  private destroy$ = new Subject();

  constructor(
    private router: Router,
    private accountService: AccountService,
    private eventService: EventService,
    private responsibilityService: ResponsibilityService,
    private userService: UserService,
    private eventManager: JhiEventManager,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isViewer =
      !this.accountService.hasAnyAuthority(AUTHORITY_ADMIN) &&
      (!this.project || this.accountService.hasAnyRole(this.project.id!, VIEWER.name));

    this.editForm
      .get('startTime')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((startTime: Date) => (this.minEndDate = startTime));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public updateForm(event: Event, newStartTime: Date, newEndTime: Date, isReadonly = true): void {
    this.isNew = !event.id;
    this.isReadonly = isReadonly;

    this.event = event;
    this.section = this.event.sections![0];
    this.location = this.section.location;
    this.project = this.location!.project;

    this.minEndDate = newStartTime;

    const { id, name, description, sections } = event;
    let { responsibility, user } = event;

    if (!isReadonly) {
      if (this.section.responsibility || this.section.user) {
        responsibility = this.section.responsibility;
        user = this.section.user;
      } else if (this.location!.responsibility || this.location!.user) {
        responsibility = this.location!.responsibility;
        user = this.location!.user;
      }

      this.responsibilityService
        .findAllByProject(this.project, { sort: ['name,asc'] })
        .subscribe((response: HttpResponse<Responsibility[]>) => (this.responsibilities = response.body || []));

      this.userService
        .findAllByProject(this.project, { sort: ['email,asc'] })
        .subscribe((response: HttpResponse<User[]>) => (this.users = response.body || []));
    }

    this.isResponsibility = !user;
    this.editForm.patchValue({
      id,
      name,
      description,
      startTime: newStartTime,
      endTime: newEndTime,
      sections,
      responsibility,
      responsibilityAutocomplete: responsibility?.name,
      user,
      userAutocomplete: user?.email,
    });
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

  edit(): void {
    const route = [
      'projects',
      this.project!.id!,
      'locations',
      this.location!.id!,
      'sections',
      this.section!.id,
      'events',
      this.event!.id!,
      'edit',
    ];
    this.router.navigate([{ outlets: { modal: route } }], {
      replaceUrl: true,
    });
  }

  delete(): void {
    this.isSaving = true;
    this.eventService.delete(this.event!.id!).subscribe(() => this.onSaveSuccess());
  }

  save(): void {
    this.isSaving = true;
    const event = this.createFromForm();

    if (event.id !== undefined) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  private createFromForm(): Event {
    const { responsibility, user } = responsibilityOrUserFromForm(this.editForm, this.isResponsibility);

    return {
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      startTime: moment(this.editForm.get(['startTime'])!.value),
      endTime: moment(this.editForm.get(['endTime'])!.value),
      sections: this.editForm.get(['sections'])!.value,
      responsibility,
      user,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Event>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.eventManager.broadcast('eventListModification');
    this.eventManager.broadcast(`eventListModificationInLocation${this.location!.id!}`);
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  isValidInput(formControlName: string): boolean {
    return !(
      this.editForm.get(formControlName)!.invalid &&
      (this.editForm.get(formControlName)!.dirty || this.editForm.get(formControlName)!.touched)
    );
  }
}
