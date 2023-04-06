import { Route } from '@angular/router';

import { DEFAULT_SORT_DATA } from 'app/config/navigation.constants';

import { ProjectRoutingResolveService } from 'app/entities/project/route/project-routing-resolve.service';

import { ProjectFromParentResolveService } from './route/project-from-parent-resolve.service';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { ProjectMemberListComponent } from './member/project-member-list.component';
import { ProjectSettingsComponent } from './settings/project-settings.component';
import { ProjectMemberInviteModalComponent } from './member/project-member-invite-modal.component';

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
        children: [
          {
            path: 'project/:id/members/invite',
            component: ProjectMemberInviteModalComponent,
            outlet: 'modal',
            pathMatch: 'full',
            resolve: {
              project: ProjectRoutingResolveService,
            },
          },
        ],
      },
    ],
    resolve: { project: ProjectFromParentResolveService },
  },
];
