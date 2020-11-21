import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.resolve';
import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

import { ScreenplayComponent } from 'app/view/project/screenplay/screenplay.component';
import { ADMIN, CONTRIBUTOR, SECRETARY, VIEWER } from 'app/shared/constants/role.constants';

export const PROJECT_ROUTES: Routes = [
  {
    path: ':projectId',
    pathMatch: 'full',
    redirectTo: ':projectId/admin',
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
      roles: [ADMIN.name, SECRETARY.name, CONTRIBUTOR.name, VIEWER.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
  },
];
