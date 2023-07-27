import { Route } from '@angular/router';

import { projectById } from 'app/entities/project/route/project-resolve.service';

const projectRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./mine/my-projects.routes'),
  },
  {
    path: ':projectId/admin',
    loadChildren: () => import('./admin/project-admin.module').then(m => m.ProjectAdminModule),
    resolve: {
      project: projectById,
    },
  },
];

export default projectRoutes;
