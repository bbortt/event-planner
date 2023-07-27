import { Route } from '@angular/router';

import { anonymousRouteAccess } from 'app/core/auth/anonymous-route-access.service';

import LandingPageComponent from './landing-page.component';

const landingPageRoutes: Route[] = [
  {
    path: '',
    component: LandingPageComponent,
    data: {
      pageTitle: 'home.title',
    },
    canActivate: [anonymousRouteAccess],
  },
];

export default landingPageRoutes;
