import { HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';

import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

@Injectable({ providedIn: 'root' })
export class LocationResolveService {
  constructor(private locationService: LocationService, private router: Router) {}

  byId(id: string | null): Observable<ILocation | null> {
    if (!id) {
      return of(null);
    }

    return this.locationService.find(Number(id)).pipe(
      mergeMap((location: HttpResponse<ILocation>) => {
        if (location.body) {
          return of(location.body);
        } else {
          this.router.navigateByUrl('404').catch(() => (window.location.href = '/404'));
          return EMPTY;
        }
      })
    );
  }
}

export const locationById: ResolveFn<ILocation | null> = (route: ActivatedRouteSnapshot) =>
  inject(LocationResolveService).byId(route.paramMap.get('locationId'));
