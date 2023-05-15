import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { userRouteAccess } from 'app/core/auth/user-route-access';

import { projectById } from './project-routing-resolve';

import { ProjectComponent } from '../list/project.component';
import { ProjectDetailComponent } from '../detail/project-detail.component';
import { ProjectUpdateComponent } from '../update/project-update.component';

const projectRoute: Routes = [
  {
    path: '',
    component: ProjectComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [userRouteAccess],
  },
  {
    path: ':id/view',
    component: ProjectDetailComponent,
    resolve: {
      project: inject(projectById),
    },
    canActivate: [userRouteAccess],
  },
  {
    path: 'new',
    component: ProjectUpdateComponent,
    resolve: {
      project: inject(projectById),
    },
    canActivate: [userRouteAccess],
  },
  {
    path: ':id/edit',
    component: ProjectUpdateComponent,
    resolve: {
      project: inject(projectById),
    },
    canActivate: [userRouteAccess],
  },
];

@NgModule({
  imports: [RouterModule.forChild(projectRoute)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
