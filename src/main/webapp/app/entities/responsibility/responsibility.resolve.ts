import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { ResponsibilityService } from './responsibility.service';

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
