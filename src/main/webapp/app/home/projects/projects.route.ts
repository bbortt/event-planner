import { Route } from '@angular/router';

import { projectById } from 'app/entities/project/route/project-resolve.service';

export const MY_PROJECTS_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => import('./mine/my-projects.module').then(m => m.MyProjectsModule),
  },
  {
    path: ':projectId/admin',
    loadChildren: () => import('./admin/project-admin.module').then(m => m.ProjectAdminModule),
    resolve: {
      project: projectById,
    },
  },
];
