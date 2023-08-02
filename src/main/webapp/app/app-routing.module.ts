import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DEBUG_INFO_ENABLED } from 'app/app.constants';

import { Authority } from 'app/config/authority.constants';

import { userRouteAccess } from 'app/core/auth/user-route-access.service';

import { errorRoute } from './layouts/error/error.route';
import NavbarComponent from './layouts/navbar/navbar.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          loadChildren: () => import('./landing-page/landing-page.route'),
        },
        {
          path: '',
          component: NavbarComponent,
          outlet: 'navbar',
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.route'),
        },
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [userRouteAccess],
          loadChildren: () => import('./admin/admin-routing.module'),
        },
        {
          path: 'home',
          canActivate: [userRouteAccess],
          loadChildren: () => import('./home/home.routes'),
        },
        {
          path: 'invitation',
          loadChildren: () => import('./invitation/invitation.module').then(m => m.InvitationModule),
        },
        {
          path: 'entities',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
