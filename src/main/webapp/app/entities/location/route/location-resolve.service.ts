import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

export const locationById: ResolveFn<ILocation | null> = (route: ActivatedRouteSnapshot): Observable<ILocation | null> => {
  const id = route.paramMap.get('locationId');

  if (!id) {
    return of(null);
  }

  const router: Router = inject(Router);
  return inject(LocationService)
    .find(Number(id))
    .pipe(
      mergeMap((location: HttpResponse<ILocation>) => {
        if (location.body) {
          return of(location.body);
        } else {
          router.navigateByUrl('404').catch(() => (window.location.href = '/404'));
          return EMPTY;
        }
      }),
    );
};

export default locationById;
