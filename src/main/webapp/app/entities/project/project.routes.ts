import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import ProjectDetailComponent from './detail/project-detail.component';
import ProjectComponent from './list/project.component';
import ProjectUpdateComponent from './update/project-update.component';

import { projectById } from './route/project-resolve.service';

const projectRoutes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectDetailComponent,
    resolve: {
      project: projectById,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectUpdateComponent,
    resolve: {
      project: projectById,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectUpdateComponent,
    resolve: {
      project: projectById,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default projectRoutes;
