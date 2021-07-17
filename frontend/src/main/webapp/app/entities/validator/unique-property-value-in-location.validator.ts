import { AbstractControl, AsyncValidatorFn } from '@angular/forms';

import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Location } from 'app/entities/location/location.model';

import { DEFAULT_DEBOUNCE } from 'app/app.constants';

export const uniquePropertyValueInLocationValidator =
  (location: Location, serviceMethod: (l: Location, v: string) => Observable<boolean>): AsyncValidatorFn =>
  (control: AbstractControl) =>
    timer(DEFAULT_DEBOUNCE).pipe(
      switchMap(() => serviceMethod(location, control.value)),
      map((valueExists: boolean) => (valueExists ? { exists: true } : null)),
      catchError(() => of(null))
    );
