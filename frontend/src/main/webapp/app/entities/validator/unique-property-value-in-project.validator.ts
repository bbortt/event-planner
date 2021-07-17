import { AbstractControl, AsyncValidatorFn } from '@angular/forms';

import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Project } from 'app/entities/project/project.model';

import { DEFAULT_DEBOUNCE } from 'app/app.constants';

export const uniquePropertyValueInProjectValidator =
  (project: Project, serviceMethod: (p: Project, v: string) => Observable<boolean>): AsyncValidatorFn =>
  (control: AbstractControl) =>
    timer(DEFAULT_DEBOUNCE).pipe(
      switchMap(() => serviceMethod(project, control.value)),
      map((valueExists: boolean) => (valueExists ? { exists: true } : null)),
      catchError(() => of(null))
    );
