import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';

import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

export const locationById: ResolveFn<ILocation | null> = (route: ActivatedRouteSnapshot): Observable<ILocation | null> => {
  const locationService = inject(LocationService);
  const router = inject(Router);

  const id = route.params['id'];

  if (id) {
    return locationService.find(id).pipe(
      mergeMap((location: HttpResponse<ILocation>) => {
        if (location.body) {
          return of(location.body);
        } else {
          router.navigateByUrl('404').catch(() => (window.location.href = '/404'));
          return EMPTY;
        }
      })
    );
  }

  return of(null);
};
