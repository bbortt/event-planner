import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.route';
import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

import { ScreenplayComponent } from 'app/view/project/screenplay/screenplay.component';

import { ROLE_ADMIN, ROLE_SECRETARY } from 'app/shared/constants/role.constants';

export const PROJECT_ROUTES: Routes = [
  {
    path: ':id',
    pathMatch: 'full',
    redirectTo: ':id/admin',
  },
  {
    path: ':id/admin',
    loadChildren: () => import('./admin/project-admin.module').then(m => m.EventPlannerProjectAdminModule),
    data: {
      roles: [ROLE_ADMIN, ROLE_SECRETARY],
    },
    canActivate: [UserRouteRoleAccessService],
  },
  {
    path: ':id/screenplay',
    component: ScreenplayComponent,
    data: {
      pageTitle: 'eventPlannerApp.project.screenplay.tabTitle',
    },
    resolve: {
      project: ProjectResolve,
    },
  },
];
