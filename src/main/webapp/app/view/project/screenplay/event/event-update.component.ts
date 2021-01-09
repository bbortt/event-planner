import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { JhiEventManager } from 'ng-jhipster';

import { EventService } from 'app/entities/event/event.service';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';
import { UserService } from 'app/core/user/user.service';

import { Event } from 'app/shared/model/event.model';
import { Location } from 'app/shared/model/location.model';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { User } from 'app/core/user/user.model';

import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import * as moment from 'moment';

@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
})
export class EventUpdateComponent implements OnInit, OnDestroy {
  isNew = false;
  isSaving = false;
  isResponsibility = false;

  responsibilities: Responsibility[] = [];
  users: User[] = [];

  location?: Location;

  minEndDate = new Date();
  dateTimeFormat = DATE_TIME_FORMAT;

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
    private eventService: EventService,
    private responsibilityService: ResponsibilityService,
    private userService: UserService,
    private eventManager: JhiEventManager,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.editForm
      .get('startTime')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((startTime: Date) => (this.minEndDate = startTime));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public updateForm(event: Event, newStartTime: Date, newEndTime: Date): void {
    this.isNew = !event.id;
    this.isResponsibility = !event.user;

    this.location = event.sections![0].location;
    this.minEndDate = newStartTime;

    const project = this.location!.project;

    this.responsibilityService
      .findAllByProject(project, { sort: ['name,asc'] })
      .subscribe((response: HttpResponse<Responsibility[]>) => (this.responsibilities = response.body || []));

    this.userService
      .findAllByProject(project, { sort: ['login,asc'] })
      .subscribe((response: HttpResponse<User[]>) => (this.users = response.body || []));

    this.editForm.patchValue({
      id: event.id,
      name: event.name,
      description: event.description,
      startTime: newStartTime,
      endTime: newEndTime,
      sections: event.sections,
      responsibility: event.responsibility,
      responsibilityAutocomplete: event.responsibility?.name,
      user: event.user,
      userAutocomplete: event.user?.login,
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

  save(): void {
    this.isSaving = true;
    const event = this.createFromForm();

    this.location = event.sections![0].location;

    if (event.id !== undefined) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  private createFromForm(): Event {
    let responsibility;
    let user;
    if (this.isResponsibility) {
      responsibility = this.editForm.get(['responsibility'])!.value;
      user = null;
    } else {
      responsibility = null;
      user = this.editForm.get(['user'])!.value;
    }

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
