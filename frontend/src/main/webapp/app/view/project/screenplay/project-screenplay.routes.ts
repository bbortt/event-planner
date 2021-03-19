import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.resolve';

import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

import { ProjectScreenplayComponent } from 'app/view/project/screenplay/project-screenplay.component';

import { Role } from 'app/shared/constants/role.constants';

export const PROJECT_SCREENPLAY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'exact',
    component: ProjectScreenplayComponent,
    data: {
      pageTitle: 'eventPlannerApp.project.screenplay.tabTitle',
      roles: [Role.ADMIN.name, Role.SECRETARY.name, Role.CONTRIBUTOR.name, Role.VIEWER.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
  },
];
