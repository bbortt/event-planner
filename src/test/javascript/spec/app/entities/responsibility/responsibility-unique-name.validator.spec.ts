import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import DoneCallback = jest.DoneCallback;
import { promiseAsObservable } from '../../../helpers/promise-as-observable';

import { AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms';

import { of } from 'rxjs';

import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { Project } from 'app/shared/model/project.model';

import { ResponsibilityUniqueNameValidator } from 'app/entities/responsibility/responsibility-unique-name.validator';

describe('ResponsibilityUniqueNameValidator', () => {
  let validator: ResponsibilityUniqueNameValidator;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [ResponsibilityService, ResponsibilityUniqueNameValidator],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    validator = TestBed.inject(ResponsibilityUniqueNameValidator);
  });

  it('returns AsyncValidatorFn', () => {
    const project = {} as Project;

    const asyncValidatorFn = validator.validate(project);
    expect(asyncValidatorFn).not.toBeNull();
  });

  describe('Validator', () => {
    let project: Project;
    let asyncValidatorFn: AsyncValidatorFn;

    beforeEach(() => {
      project = { id: 1234 } as Project;
      asyncValidatorFn = validator.validate(project);
    });

    it('returns no ValidationErrors if API returns `false`', (done: DoneCallback) => {
      const mockResponsibilityService = TestBed.inject(ResponsibilityService);
      const nameExistsInProject = spyOn(mockResponsibilityService, 'nameExistsInProject').and.returnValue(of(false));

      const control = new FormControl('value');

      const validatorResult = asyncValidatorFn(control);
      promiseAsObservable(validatorResult).subscribe((validationErrors: ValidationErrors | null) => {
        expect(validationErrors).toBeNull();
        expect(nameExistsInProject).toHaveBeenCalled();
        done();
      });
    });

    it('returns ValidationErrors if API returns `true`', (done: DoneCallback) => {
      const mockResponsibilityService = TestBed.inject(ResponsibilityService);
      const nameExistsInProject = spyOn(mockResponsibilityService, 'nameExistsInProject').and.returnValue(of(true));

      const control = new FormControl('value');

      const validatorResult = asyncValidatorFn(control);
      promiseAsObservable(validatorResult).subscribe((validationErrors: ValidationErrors | null) => {
        expect(validationErrors).toEqual({ exists: true });
        expect(nameExistsInProject).toHaveBeenCalled();
        done();
      });
    });
  });
});
