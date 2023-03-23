import { Route } from '@angular/router';

import { ProjectFromParentResolveService } from './route/project-from-parent-resolve.service';

import { DEFAULT_SORT_DATA } from '../../../config/navigation.constants';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { ProjectMemberListComponent } from './member/project-member-list.component';
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
      {
        path: 'members',
        component: ProjectMemberListComponent,
        data: {
          [DEFAULT_SORT_DATA]: 'acceptedDate,desc',
        },
        resolve: { project: ProjectFromParentResolveService },
      },
    ],
    resolve: { project: ProjectFromParentResolveService },
  },
];
