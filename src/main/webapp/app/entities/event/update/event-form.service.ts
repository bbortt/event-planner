import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEvent, NewEvent } from '../event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvent for edit and NewEventFormGroupInput for create.
 */
type EventFormGroupInput = IEvent | PartialWithRequiredKeyOf<NewEvent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEvent | NewEvent> = Omit<T, 'startDateTime' | 'endDateTime' | 'createdDate' | 'lastModifiedDate'> & {
  startDateTime?: string | null;
  endDateTime?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type EventFormRawValue = FormValueOf<IEvent>;

type NewEventFormRawValue = FormValueOf<NewEvent>;

type EventFormDefaults = Pick<NewEvent, 'id' | 'startDateTime' | 'endDateTime' | 'createdDate' | 'lastModifiedDate'>;

type EventFormGroupContent = {
  id: FormControl<EventFormRawValue['id'] | NewEvent['id']>;
  name: FormControl<EventFormRawValue['name']>;
  startDateTime: FormControl<EventFormRawValue['startDateTime']>;
  endDateTime: FormControl<EventFormRawValue['endDateTime']>;
  createdBy: FormControl<EventFormRawValue['createdBy']>;
  createdDate: FormControl<EventFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<EventFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<EventFormRawValue['lastModifiedDate']>;
  location: FormControl<EventFormRawValue['location']>;
};

export type EventFormGroup = FormGroup<EventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventFormService {
  createEventFormGroup(event: EventFormGroupInput = { id: null }): EventFormGroup {
    const eventRawValue = this.convertEventToEventRawValue({
      ...this.getFormDefaults(),
      ...event,
    });
    return new FormGroup<EventFormGroupContent>({
      id: new FormControl(
        { value: eventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(eventRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(63)],
      }),
      startDateTime: new FormControl(eventRawValue.startDateTime, {
        validators: [Validators.required],
      }),
      endDateTime: new FormControl(eventRawValue.endDateTime, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(eventRawValue.createdBy),
      createdDate: new FormControl(eventRawValue.createdDate),
      lastModifiedBy: new FormControl(eventRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(eventRawValue.lastModifiedDate),
      location: new FormControl(eventRawValue.location, {
        validators: [Validators.required],
      }),
    });
  }

  getEvent(form: EventFormGroup): IEvent | NewEvent {
    return this.convertEventRawValueToEvent(form.getRawValue() as EventFormRawValue | NewEventFormRawValue);
  }

  resetForm(form: EventFormGroup, event: EventFormGroupInput): void {
    const eventRawValue = this.convertEventToEventRawValue({ ...this.getFormDefaults(), ...event });
    form.reset(
      {
        ...eventRawValue,
        id: { value: eventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EventFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDateTime: currentTime,
      endDateTime: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertEventRawValueToEvent(rawEvent: EventFormRawValue | NewEventFormRawValue): IEvent | NewEvent {
    return {
      ...rawEvent,
      startDateTime: dayjs(rawEvent.startDateTime, DATE_TIME_FORMAT),
      endDateTime: dayjs(rawEvent.endDateTime, DATE_TIME_FORMAT),
      createdDate: dayjs(rawEvent.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawEvent.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertEventToEventRawValue(
    event: IEvent | (Partial<NewEvent> & EventFormDefaults),
  ): EventFormRawValue | PartialWithRequiredKeyOf<NewEventFormRawValue> {
    return {
      ...event,
      startDateTime: event.startDateTime ? event.startDateTime.format(DATE_TIME_FORMAT) : undefined,
      endDateTime: event.endDateTime ? event.endDateTime.format(DATE_TIME_FORMAT) : undefined,
      createdDate: event.createdDate ? event.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: event.lastModifiedDate ? event.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
