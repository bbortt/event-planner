import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.resolve';

import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

import { ProjectAdminComponent } from 'app/view/project/admin/project-admin.component';
import { ProjectEventsHistoryComponent } from 'app/view/project/admin/history/project-events-history.component';
import { ProjectLocationsComponent } from 'app/view/project/admin/locations/project-locations.component';
import { ProjectResponsibilitiesComponent } from 'app/view/project/admin/responsibilities/project-responsibilities.component';
import { ProjectUsersComponent } from 'app/view/project/admin/users/project-users.component';

import { Role } from 'app/config/role.constants';

export const PROJECT_ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'exact',
    component: ProjectAdminComponent,
    data: {
      pageTitle: 'eventPlannerApp.project.admin.tabTitle',
      roles: [Role.ADMIN.name, Role.SECRETARY.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
    children: [
      {
        path: 'locations',
        component: ProjectLocationsComponent,
        resolve: {
          project: ProjectResolve,
        },
      },
      {
        path: 'users',
        component: ProjectUsersComponent,
        resolve: {
          project: ProjectResolve,
        },
      },
      {
        path: 'responsibilities',
        component: ProjectResponsibilitiesComponent,
        resolve: {
          project: ProjectResolve,
        },
      },
      {
        path: 'events/history',
        component: ProjectEventsHistoryComponent,
        data: {
          defaultSort: 'id,asc',
        },
        resolve: {
          project: ProjectResolve,
        },
      },
    ],
  },
];
