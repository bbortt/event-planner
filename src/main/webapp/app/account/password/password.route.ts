import { Route } from '@angular/router';

import { UserRouteAuthorityAccessService } from 'app/core/auth/user-route-authority-access-service';
import { PasswordComponent } from './password.component';
import { AUTHORITY_USER } from 'app/shared/constants/authority.constants';

export const passwordRoute: Route = {
  path: 'password',
  component: PasswordComponent,
  data: {
    authorities: [AUTHORITY_USER],
    pageTitle: 'global.menu.account.password',
  },
  canActivate: [UserRouteAuthorityAccessService],
};
