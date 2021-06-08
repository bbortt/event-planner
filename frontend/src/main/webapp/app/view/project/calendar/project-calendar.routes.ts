import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.resolve';

import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

import { Role } from 'app/config/role.constants';

import { ProjectCalendarComponent } from 'app/view/project/calendar/project-calendar.component';

export const PROJECT_CALENDAR_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'exact',
    component: ProjectCalendarComponent,
    data: {
      pageTitle: 'eventPlannerApp.project.calendar.tabTitle',
      roles: [Role.ADMIN.name, Role.SECRETARY.name, Role.CONTRIBUTOR.name, Role.VIEWER.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
  },
];
