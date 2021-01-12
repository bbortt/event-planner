import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';

import { Project } from 'app/shared/model/project.model';

import { DEFAULT_DEBOUNCE } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class ResponsibilityUniqueNameValidator {
  constructor(private responsibilityService: ResponsibilityService) {}

  public validate(aproject: Project): AsyncValidatorFn {
    const validator = new Validator(aproject, this.responsibilityService);
    return (control: AbstractControl) => timer(DEFAULT_DEBOUNCE).pipe(switchMap(() => validator.validate(control)));
  }
}

class Validator implements AsyncValidator {
  constructor(private project: Project, private responsibilityService: ResponsibilityService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.responsibilityService.nameExistsInProject(this.project, control.value).pipe(
      map((nameExists: boolean) => (nameExists ? { exists: true } : null)),
      catchError(() => of(null))
    );
  }
}
