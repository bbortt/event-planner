import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.route';
import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

import { ProjectComponent } from 'app/view/project/project.component';
import { ScreenplayComponent } from 'app/view/project/screenplay/screenplay.component';

import { ROLE_ADMIN, ROLE_SECRETARY } from 'app/shared/constants/role.constants';

export const PROJECT_ROUTES: Routes = [
  {
    path: ':projectId',
    component: ProjectComponent,
    data: {
      defaultSort: 'id,asc',
      pageTitle: 'eventPlannerApp.project.overview.tabTitle',
      roles: [ROLE_ADMIN, ROLE_SECRETARY],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
  },
  {
    path: ':projectId/screenplay',
    component: ScreenplayComponent,
    data: {
      pageTitle: 'eventPlannerApp.project.screenplay.tabTitle',
    },
    resolve: {
      project: ProjectResolve,
    },
  },
];
