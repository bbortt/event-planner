import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.route';
import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

import { ProjectAdminComponent } from 'app/view/project/admin/project-admin.component';
import { LocationsComponent } from 'app/view/project/admin/locations/locations.component';
import { ResponsibilitiesComponent } from 'app/view/project/admin/responsibilities/responsibilities.component';
import { UsersComponent } from 'app/view/project/admin/users/users.component';

import { ROLE_ADMIN, ROLE_SECRETARY } from 'app/shared/constants/role.constants';

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
        component: LocationsComponent,
        data: {
          defaultSort: 'id,asc',
        },
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          defaultSort: 'id,asc',
        },
      },
      {
        path: 'responsibilities',
        component: ResponsibilitiesComponent,
        data: {
          defaultSort: 'id,asc',
        },
      },
    ],
  },
];
