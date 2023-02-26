import { Route } from '@angular/router';

import { AnonymousRouteAccessService } from '../core/auth/anonymous-route-access.service';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';

import { HomeComponent } from './home.component';
import { LandingPageComponent } from './landing-page.component';

export const HOME_ROUTES: Route[] = [
  {
    path: '',
    component: LandingPageComponent,
    data: {
      pageTitle: 'home.title',
    },
    canActivate: [AnonymousRouteAccessService],
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      pageTitle: 'home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
