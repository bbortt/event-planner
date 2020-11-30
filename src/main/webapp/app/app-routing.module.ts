import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { UserRouteAuthorityAccessService } from 'app/core/auth/user-route-authority-access-service';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { AUTHORITY_ADMIN } from 'app/shared/constants/authority.constants';

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [AUTHORITY_ADMIN],
          },
          canActivate: [UserRouteAuthorityAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        ...LAYOUT_ROUTES,
      ],
      {
        preloadingStrategy: PreloadAllModules,
      }
    ),
  ],
  exports: [RouterModule],
})
export class EventPlannerAppRoutingModule {}
