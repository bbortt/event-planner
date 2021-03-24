import {promiseAsObservable} from '../../../../../test/helpers/promise-as-observable';

import { FormControl, ValidationErrors } from '@angular/forms';

import { of } from 'rxjs';

import { Location } from 'app/entities/location/location.model';

import { uniquePropertyValueInLocationValidator } from 'app/entities/validator/unique-property-value-in-location.validator';

import DoneCallback = jest.DoneCallback;
import createSpy = jasmine.createSpy;

describe('uniquePropertyValueInLocationValidator', () => {
  let location: Location;

  beforeEach(() => {
    location = { id: 1234 } as Location;
  });

  it('returns no ValidationErrors if API returns `false`', (done: DoneCallback) => {
    const serviceMethod = createSpy().and.returnValue(of(false));
    const asyncValidatorFn = uniquePropertyValueInLocationValidator(location, serviceMethod);

    const formValue = 'form-value';
    const control = new FormControl(formValue);

    const validatorResult = asyncValidatorFn(control);
    promiseAsObservable(validatorResult).subscribe((validationErrors: ValidationErrors | null) => {
      expect(validationErrors).toBeNull();
      expect(serviceMethod).toHaveBeenCalledWith(location, formValue);
      done();
    });
  });

  it('returns ValidationErrors if API returns `true`', (done: DoneCallback) => {
    const serviceMethod = createSpy().and.returnValue(of(true));
    const asyncValidatorFn = uniquePropertyValueInLocationValidator(location, serviceMethod);

    const formValue = 'form-value';
    const control = new FormControl(formValue);

    const validatorResult = asyncValidatorFn(control);
    promiseAsObservable(validatorResult).subscribe((validationErrors: ValidationErrors | null) => {
      expect(validationErrors).toEqual({ exists: true });
      expect(serviceMethod).toHaveBeenCalledWith(location, formValue);
      done();
    });
  });
});
