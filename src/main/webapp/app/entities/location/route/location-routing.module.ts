import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { userRouteAccess } from 'app/core/auth/user-route-access';

import { locationById } from './location-routing-resolve';

import { LocationComponent } from '../list/location.component';
import { LocationDetailComponent } from '../detail/location-detail.component';
import { LocationUpdateComponent } from '../update/location-update.component';

const locationRoute: Routes = [
  {
    path: '',
    component: LocationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [userRouteAccess],
  },
  {
    path: ':id/view',
    component: LocationDetailComponent,
    resolve: {
      location: inject(locationById),
    },
    canActivate: [userRouteAccess],
  },
  {
    path: 'new',
    component: LocationUpdateComponent,
    resolve: {
      location: inject(locationById),
    },
    canActivate: [userRouteAccess],
  },
  {
    path: ':id/edit',
    component: LocationUpdateComponent,
    resolve: {
      location: inject(locationById),
    },
    canActivate: [userRouteAccess],
  },
];

@NgModule({
  imports: [RouterModule.forChild(locationRoute)],
  exports: [RouterModule],
})
export class LocationRoutingModule {}
