import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { projectById } from 'app/entities/project/route/project-routing-resolve';

export const MY_PROJECTS_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => import('./mine/my-projects.module').then(m => m.MyProjectsModule),
  },
  {
    path: ':id/admin',
    loadChildren: () => import('./admin/project-admin.module').then(m => m.ProjectAdminModule),
    resolve: {
      project: inject(projectById),
    },
  },
];
