import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { ResponsibilityService } from './responsibility.service';

import { Responsibility } from 'app/entities/responsibility/responsibility.model';

@Injectable({ providedIn: 'root' })
export class ResponsibilityResolve implements Resolve<Responsibility> {
  constructor(private service: ResponsibilityService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Responsibility> | Observable<never> {
    let responsibilityId = route.params['responsibilityId'];

    // Search recursively for Route.children
    let parent = route.parent;
    while (!responsibilityId && parent) {
      responsibilityId = parent.params['responsibilityId'];
      parent = parent.parent;
    }

    if (responsibilityId) {
      return this.service.find(responsibilityId).pipe(
        flatMap((responsibility: HttpResponse<Responsibility>) => {
          if (responsibility.body) {
            return of(responsibility.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }

    return of({} as Responsibility);
  }
}
