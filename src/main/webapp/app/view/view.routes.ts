import { Routes } from '@angular/router';

import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

import { HomeComponent } from './home.component';
import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';

import { ROLE_ADMIN, ROLE_CONTRIBUTOR, ROLE_SECRETARY, ROLE_VIEWER } from 'app/shared/constants/role.constants';

export const VIEW_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      defaultSort: 'id,asc',
      pageTitle: 'home.title',
    },
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then(m => m.EventPlannerProjectModule),
    data: {
      roles: [ROLE_ADMIN, ROLE_SECRETARY, ROLE_CONTRIBUTOR, ROLE_VIEWER],
    },
    canActivate: [UserRouteRoleAccessService],
  },
  {
    path: 'create-project',
    component: CreateProjectModalComponent,
    outlet: 'modal',
  },
];
