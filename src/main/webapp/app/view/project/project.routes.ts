import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.route';
import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

import { ScreenplayComponent } from 'app/view/project/screenplay/screenplay.component';

import { ROLE_ADMIN, ROLE_CONTRIBUTOR, ROLE_SECRETARY, ROLE_VIEWER } from 'app/shared/constants/role.constants';

export const PROJECT_ROUTES: Routes = [
  {
    path: ':projectId',
    pathMatch: 'full',
    redirectTo: ':id/admin',
  },
  {
    path: ':projectId/admin',
    loadChildren: () => import('./admin/project-admin.module').then(m => m.EventPlannerProjectAdminModule),
  },
  {
    path: ':projectId/screenplay',
    component: ScreenplayComponent,
    data: {
      pageTitle: 'eventPlannerApp.project.screenplay.tabTitle',
      roles: [ROLE_ADMIN, ROLE_SECRETARY, ROLE_CONTRIBUTOR, ROLE_VIEWER],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
  },
];
