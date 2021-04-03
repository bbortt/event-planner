import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { EventService } from 'app/entities/event/event.service';
import { ProjectService } from 'app/entities/project/project.service';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { Event } from 'app/entities/event/event.model';
import { Location } from 'app/entities/location/location.model';
import { Project } from 'app/entities/project/project.model';
import { Responsibility } from 'app/entities/responsibility/responsibility.model';
import { Section } from 'app/entities/section/section.model';

import { Authority } from 'app/config/authority.constants';
import { Role } from 'app/config/role.constants';

import { Account } from 'app/core/auth/account.model';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import responsibilityOrUserFromForm from 'app/shared/util/responsibility-or-user-from-form';

import * as moment from 'moment';
import { User } from 'app/entities/user/user.model';

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
  users: Account[] = [];

  project?: Project;

  minEndDate = new Date();
  dateTimeFormat = DATE_TIME_FORMAT;

  isResponsibility = false;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    description: [],
    startTime: [new Date(), [Validators.required]],
    endTime: [new Date(), [Validators.required]],
    section: [null, [Validators.required]],
    responsibility: [],
    responsibilityAutocomplete: [],
    user: [],
    userAutocomplete: [],
  });

  private location?: Location;
  private section?: Section;
  private event?: Event;

  private destroy$ = new Subject();

  constructor(
    private router: Router,
    private eventManager: EventManager,
    private fb: FormBuilder,
    private accountService: AccountService,
    private eventService: EventService,
    private projectService: ProjectService,
    private responsibilityService: ResponsibilityService
  ) {}

  ngOnInit(): void {
    this.isViewer =
      !this.accountService.hasAnyAuthority(Authority.ADMIN) &&
      (!this.project || this.accountService.hasAnyRole(this.project.id!, Role.VIEWER.name));

    this.editForm
      .get('startTime')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((startTime: Date) => (this.minEndDate = startTime));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateForm(event: Event, newStartTime: Date, newEndTime: Date, isReadonly = true): void {
    this.isNew = !event.id;
    this.isReadonly = isReadonly;

    this.event = event;
    this.section = this.event.section;
    this.location = this.section.location;
    this.project = this.location.project;

    this.minEndDate = newStartTime;

    const { id, name, description, section } = event;
    let { responsibility, user } = event;

    if (!isReadonly) {
      if (this.section.responsibility || this.section.user) {
        responsibility = this.section.responsibility;
        user = this.section.user;
      } else if (this.location.responsibility || this.location.user) {
        responsibility = this.location.responsibility;
        user = this.location.user;
      }

      this.responsibilityService
        .findAllByProject(this.project, { sort: ['name,asc'] })
        .subscribe((response: HttpResponse<Responsibility[]>) => (this.responsibilities = response.body ?? []));

      this.projectService.getAllUsers(this.project).subscribe((users: Account[]) => (this.users = users));
    }

    this.isResponsibility = !user;
    this.editForm.patchValue({
      id,
      name,
      description,
      startTime: newStartTime,
      endTime: newEndTime,
      section,
      responsibility,
      responsibilityAutocomplete: responsibility?.name,
      user,
      userAutocomplete: user?.email,
    });
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

  isValidInput(formControlName: string): boolean {
    return !(
      this.editForm.get(formControlName)!.invalid &&
      (this.editForm.get(formControlName)!.dirty || this.editForm.get(formControlName)!.touched)
    );
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

  private createFromForm(): Event {
    const { responsibility, user } = responsibilityOrUserFromForm(this.editForm, this.isResponsibility);

    return {
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      startTime: moment(this.editForm.get(['startTime'])!.value),
      endTime: moment(this.editForm.get(['endTime'])!.value),
      section: this.editForm.get(['section'])!.value,
      responsibility,
      user,
    };
  }
}
