import { Route } from '@angular/router';

import { ProjectFromParentResolveService } from './route/project-from-parent-resolve.service';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { ProjectSettingsComponent } from './settings/project-settings.component';

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
        component: ProjectSettingsComponent,
        resolve: { project: ProjectFromParentResolveService },
      },
    ],
  },
];
