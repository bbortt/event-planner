import { Route } from '@angular/router';

import { anonymousRouteAccess } from 'app/core/auth/anonymous-route-access';

import { LandingPageComponent } from './landing-page.component';

export const LANDING_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: LandingPageComponent,
    data: {
      pageTitle: 'home.title',
    },
    canActivate: [anonymousRouteAccess],
  },
];
