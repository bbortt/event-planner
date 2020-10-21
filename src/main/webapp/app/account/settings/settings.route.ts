import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { SettingsComponent } from './settings.component';
import { AUTHORITY_USER } from 'app/shared/constants/authority.constants';

export const settingsRoute: Route = {
  path: 'settings',
  component: SettingsComponent,
  data: {
    authorities: [AUTHORITY_USER],
    pageTitle: 'global.menu.account.settings',
  },
  canActivate: [UserRouteAccessService],
};
