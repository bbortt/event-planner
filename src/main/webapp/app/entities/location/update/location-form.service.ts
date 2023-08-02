import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILocation, NewLocation } from '../location.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILocation for edit and NewLocationFormGroupInput for create.
 */
type LocationFormGroupInput = ILocation | PartialWithRequiredKeyOf<NewLocation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILocation | NewLocation> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type LocationFormRawValue = FormValueOf<ILocation>;

type NewLocationFormRawValue = FormValueOf<NewLocation>;

type LocationFormDefaults = Pick<NewLocation, 'id' | 'createdDate' | 'lastModifiedDate'>;

type LocationFormGroupContent = {
  id: FormControl<LocationFormRawValue['id'] | NewLocation['id']>;
  name: FormControl<LocationFormRawValue['name']>;
  description: FormControl<LocationFormRawValue['description']>;
  createdBy: FormControl<LocationFormRawValue['createdBy']>;
  createdDate: FormControl<LocationFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<LocationFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<LocationFormRawValue['lastModifiedDate']>;
  project: FormControl<LocationFormRawValue['project']>;
  parent: FormControl<LocationFormRawValue['parent']>;
};

export type LocationFormGroup = FormGroup<LocationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LocationFormService {
  createLocationFormGroup(location: LocationFormGroupInput = { id: null }): LocationFormGroup {
    const locationRawValue = this.convertLocationToLocationRawValue({
      ...this.getFormDefaults(),
      ...location,
    });
    return new FormGroup<LocationFormGroupContent>({
      id: new FormControl(
        { value: locationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(locationRawValue.name, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(63)],
      }),
      description: new FormControl(locationRawValue.description, {
        validators: [Validators.maxLength(255)],
      }),
      createdBy: new FormControl(locationRawValue.createdBy),
      createdDate: new FormControl(locationRawValue.createdDate),
      lastModifiedBy: new FormControl(locationRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(locationRawValue.lastModifiedDate),
      project: new FormControl(locationRawValue.project, {
        validators: [Validators.required],
      }),
      parent: new FormControl(locationRawValue.parent),
    });
  }

  getLocation(form: LocationFormGroup): ILocation | NewLocation {
    return this.convertLocationRawValueToLocation(form.getRawValue() as LocationFormRawValue | NewLocationFormRawValue);
  }

  resetForm(form: LocationFormGroup, location: LocationFormGroupInput): void {
    const locationRawValue = this.convertLocationToLocationRawValue({ ...this.getFormDefaults(), ...location });
    form.reset(
      {
        ...locationRawValue,
        id: { value: locationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LocationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertLocationRawValueToLocation(rawLocation: LocationFormRawValue | NewLocationFormRawValue): ILocation | NewLocation {
    return {
      ...rawLocation,
      createdDate: dayjs(rawLocation.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawLocation.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertLocationToLocationRawValue(
    location: ILocation | (Partial<NewLocation> & LocationFormDefaults)
  ): LocationFormRawValue | PartialWithRequiredKeyOf<NewLocationFormRawValue> {
    return {
      ...location,
      createdDate: location.createdDate ? location.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: location.lastModifiedDate ? location.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
