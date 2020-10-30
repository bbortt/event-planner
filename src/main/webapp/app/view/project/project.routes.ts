import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.route';

import { ProjectComponent } from './project.component';
import { ScreenplayComponent } from 'app/view/project/screenplay/screenplay.component';

import { ROLE_ADMIN, ROLE_SECRETARY } from 'app/shared/constants/role.constants';

export const PROJECT_ROUTES: Routes = [
  {
    path: ':id',
    component: ProjectComponent,
    data: {
      defaultSort: 'id,asc',
      pageTitle: 'eventPlannerApp.project.overview.tabTitle',
      roles: [ROLE_ADMIN, ROLE_SECRETARY],
    },
    canActivate: [],
    resolve: {
      project: ProjectResolve,
    },
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
