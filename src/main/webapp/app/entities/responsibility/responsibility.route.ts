import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router, Routes } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IResponsibility, Responsibility } from 'app/shared/model/responsibility.model';
import { ResponsibilityService } from './responsibility.service';
import { ResponsibilityComponent } from './responsibility.component';
import { ResponsibilityDetailComponent } from './responsibility-detail.component';
import { ResponsibilityUpdateComponent } from './responsibility-update.component';

@Injectable({ providedIn: 'root' })
export class ResponsibilityResolve implements Resolve<IResponsibility> {
  constructor(private service: ResponsibilityService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IResponsibility> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
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
    return of(new Responsibility());
  }
}

export const responsibilityRoute: Routes = [
  {
    path: '',
    component: ResponsibilityComponent,
    data: {
      defaultSort: 'id,asc',
      pageTitle: 'eventPlannerApp.responsibility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResponsibilityDetailComponent,
    resolve: {
      responsibility: ResponsibilityResolve,
    },
    data: {
      pageTitle: 'eventPlannerApp.responsibility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResponsibilityUpdateComponent,
    resolve: {
      responsibility: ResponsibilityResolve,
    },
    data: {
      pageTitle: 'eventPlannerApp.responsibility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResponsibilityUpdateComponent,
    resolve: {
      responsibility: ResponsibilityResolve,
    },
    data: {
      pageTitle: 'eventPlannerApp.responsibility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
