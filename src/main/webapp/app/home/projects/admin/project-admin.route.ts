import { Route } from '@angular/router';

import { ProjectFromParentResolveService } from './route/project-from-parent-resolve.service';

import { ProjectUpdateComponent } from '../../../entities/project/update/project-update.component';

import { AdminLayoutComponent } from './layout/admin-layout.component';

export const PROJECT_ADMIN_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'settings',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'settings',
        component: ProjectUpdateComponent,
        resolve: { project: ProjectFromParentResolveService },
      },
    ],
  },
];
