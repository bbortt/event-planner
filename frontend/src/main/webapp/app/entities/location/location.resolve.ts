import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { EMPTY, NEVER, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { LocationService } from './location.service';

import { Location } from 'app/entities/location/location.model';

@Injectable({ providedIn: 'root' })
export class LocationResolve implements Resolve<Location> {
  constructor(private service: LocationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Location> | Observable<never> {
    let locationId = route.params['locationId'];

    // Search recursively for Route.children
    let parent = route.parent;
    while (!locationId && parent) {
      locationId = parent.params['locationId'];
      parent = parent.parent;
    }

    if (locationId) {
      return this.service.find(locationId).pipe(
        flatMap((location: HttpResponse<Location>) => {
          if (location.body) {
            return of(location.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }

    return NEVER;
  }
}
