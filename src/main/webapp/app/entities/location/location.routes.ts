import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import LocationDetailComponent from './detail/location-detail.component';
import LocationComponent from './list/location.component';
import LocationUpdateComponent from './update/location-update.component';

import { locationById } from './route/location-resolve.service';

const locationRoutes: Routes = [
  {
    path: '',
    component: LocationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':locationId/view',
    component: LocationDetailComponent,
    resolve: {
      location: locationById,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LocationUpdateComponent,
    resolve: {
      location: locationById,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':locationId/edit',
    component: LocationUpdateComponent,
    resolve: {
      location: locationById,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default locationRoutes;
