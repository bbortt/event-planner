import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router, Routes } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { AUTHORITY_ADMIN } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Event, IEvent } from 'app/shared/model/event.model';
import { EventService } from './event.service';
import { EventComponent } from './event.component';
import { EventDetailComponent } from './event-detail.component';
import { EventUpdateComponent } from './event-update.component';

@Injectable({ providedIn: 'root' })
export class EventResolve implements Resolve<IEvent> {
  constructor(private service: EventService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEvent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((event: HttpResponse<Event>) => {
          if (event.body) {
            return of(event.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Event());
  }
}

export const eventRoute: Routes = [
  {
    path: '',
    component: EventComponent,
    data: {
      authorities: [AUTHORITY_ADMIN],
      defaultSort: 'id,asc',
      pageTitle: 'eventPlannerApp.event.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventDetailComponent,
    resolve: {
      event: EventResolve,
    },
    data: {
      authorities: [AUTHORITY_ADMIN],
      pageTitle: 'eventPlannerApp.event.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventUpdateComponent,
    resolve: {
      event: EventResolve,
    },
    data: {
      authorities: [AUTHORITY_ADMIN],
      pageTitle: 'eventPlannerApp.event.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventUpdateComponent,
    resolve: {
      event: EventResolve,
    },
    data: {
      authorities: [AUTHORITY_ADMIN],
      pageTitle: 'eventPlannerApp.event.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
