import { promiseAsObservable } from '../../../../../test/helpers/promise-as-observable';

import { FormControl, ValidationErrors } from '@angular/forms';

import { of } from 'rxjs';

import { Project } from 'app/entities/project/project.model';

import { uniquePropertyValueInProjectValidator } from 'app/entities/validator/unique-property-value-in-project.validator';

import DoneCallback = jest.DoneCallback;

describe('uniquePropertyValueInProjectValidator', () => {
  let project: Project;

  beforeEach(() => {
    project = { id: 1234 } as Project;
  });

  it('returns no ValidationErrors if API returns `false`', (done: DoneCallback) => {
    const serviceMethod = jest.fn().mockReturnValueOnce(of(false));
    const asyncValidatorFn = uniquePropertyValueInProjectValidator(project, serviceMethod);

    const formValue = 'form-value';
    const control = new FormControl(formValue);

    const validatorResult = asyncValidatorFn(control);
    promiseAsObservable(validatorResult).subscribe((validationErrors: ValidationErrors | null) => {
      expect(validationErrors).toBeNull();
      expect(serviceMethod).toHaveBeenCalledWith(project, formValue);
      done();
    });
  });

  it('returns ValidationErrors if API returns `true`', (done: DoneCallback) => {
    const serviceMethod = jest.fn().mockReturnValueOnce(of(true));
    const asyncValidatorFn = uniquePropertyValueInProjectValidator(project, serviceMethod);

    const formValue = 'form-value';
    const control = new FormControl(formValue);

    const validatorResult = asyncValidatorFn(control);
    promiseAsObservable(validatorResult).subscribe((validationErrors: ValidationErrors | null) => {
      expect(validationErrors).toEqual({ exists: true });
      expect(serviceMethod).toHaveBeenCalledWith(project, formValue);
      done();
    });
  });
});
