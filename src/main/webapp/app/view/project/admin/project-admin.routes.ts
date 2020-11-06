import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.route';

import { ProjectAdminComponent } from 'app/view/project/admin/project-admin.component';
import { ProjectLocationsComponent } from 'app/view/project/admin/locations/project-locations.component';
import { ProjectResponsibilitiesComponent } from 'app/view/project/admin/responsibilities/project-responsibilities.component';
import { ProjectUsersComponent } from 'app/view/project/admin/users/project-users.component';
import { ROLE_ADMIN, ROLE_SECRETARY } from 'app/shared/constants/role.constants';
import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

export const PROJECT_ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: ProjectAdminComponent,
    data: {
      pageTitle: 'eventPlannerApp.project.admin.tabTitle',
      roles: [ROLE_ADMIN, ROLE_SECRETARY],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
    children: [
      {
        path: 'locations',
        component: ProjectLocationsComponent,
        data: {
          defaultSort: 'id,asc',
        },
      },
      {
        path: 'users',
        component: ProjectUsersComponent,
        data: {
          defaultSort: 'id,asc',
        },
      },
      {
        path: 'responsibilities',
        component: ProjectResponsibilitiesComponent,
        data: {
          defaultSort: 'id,asc',
        },
      },
    ],
  },
];
