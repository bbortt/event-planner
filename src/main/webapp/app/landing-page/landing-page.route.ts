import { Route } from '@angular/router';

import { AnonymousRouteAccessService } from '../core/auth/anonymous-route-access.service';
import { LandingPageComponent } from '../landing-page/landing-page.component';

export const LANDING_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: LandingPageComponent,
    data: {
      pageTitle: 'home.title',
    },
    canActivate: [AnonymousRouteAccessService],
  },
];
