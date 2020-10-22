import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ILocationTimeSlot, LocationTimeSlot } from 'app/shared/model/location-time-slot.model';
import { LocationTimeSlotService } from './location-time-slot.service';
import { LocationTimeSlotComponent } from './location-time-slot.component';
import { LocationTimeSlotDetailComponent } from './location-time-slot-detail.component';
import { LocationTimeSlotUpdateComponent } from './location-time-slot-update.component';

@Injectable({ providedIn: 'root' })
export class LocationTimeSlotResolve implements Resolve<ILocationTimeSlot> {
  constructor(private service: LocationTimeSlotService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILocationTimeSlot> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((locationTimeSlot: HttpResponse<LocationTimeSlot>) => {
          if (locationTimeSlot.body) {
            return of(locationTimeSlot.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LocationTimeSlot());
  }
}

export const locationTimeSlotRoute: Routes = [
  {
    path: '',
    component: LocationTimeSlotComponent,
    data: {
      authorities: [Authority.ADMIN],
      defaultSort: 'id,asc',
      pageTitle: 'eventPlannerApp.locationTimeSlot.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LocationTimeSlotDetailComponent,
    resolve: {
      locationTimeSlot: LocationTimeSlotResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'eventPlannerApp.locationTimeSlot.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LocationTimeSlotUpdateComponent,
    resolve: {
      locationTimeSlot: LocationTimeSlotResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'eventPlannerApp.locationTimeSlot.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LocationTimeSlotUpdateComponent,
    resolve: {
      locationTimeSlot: LocationTimeSlotResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'eventPlannerApp.locationTimeSlot.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
