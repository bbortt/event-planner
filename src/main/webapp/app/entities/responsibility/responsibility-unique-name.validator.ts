import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { Project } from 'app/shared/model/project.model';

import { DEFAULT_DEBOUNCE } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class ResponsibilityUniqueNameValidator {
  constructor(private responsibilityService: ResponsibilityService) {}

  public validate(aproject: Project): AsyncValidatorFn {
    const validator = new Validator(aproject, this.responsibilityService);
    return (control: AbstractControl) =>
      control.valueChanges.pipe(
        debounceTime(DEFAULT_DEBOUNCE),
        switchMap(() => validator.validate(control))
      );
  }
}

class Validator implements AsyncValidator {
  constructor(private project: Project, private responsibilityService: ResponsibilityService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.responsibilityService.nameUniquePerProject(this.project, control.value).pipe(
      map((isUniquePerProject: boolean) => (isUniquePerProject ? of(null) : { uniqueness: true })),
      catchError(() => of(null))
    );
  }
}
