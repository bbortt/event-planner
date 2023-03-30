import { Route } from '@angular/router';

import { ProjectFromParentResolveService } from './route/project-from-parent-resolve.service';

import { DEFAULT_SORT_DATA } from '../../../config/navigation.constants';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { ProjectMemberListComponent } from './member/project-member-list.component';
import { ProjectSettingsComponent } from './settings/project-settings.component';
import { ProjectMemberInviteModalComponent } from './member/project-member-invite-modal.component';
import { ProjectRoutingResolveService } from '../../../entities/project/route/project-routing-resolve.service';

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
