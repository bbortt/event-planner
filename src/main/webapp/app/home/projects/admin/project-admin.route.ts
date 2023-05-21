import { Route } from '@angular/router';

import { DEFAULT_SORT_DATA } from 'app/config/navigation.constants';

import { locationById } from 'app/entities/location/route/location-resolve.service';
import { projectById } from 'app/entities/project/route/project-resolve.service';

import { projectFromParentRoute } from './route/project-from-parent.resolve';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { ProjectLocationsDragAndDropComponent } from './locations/project-locations-drag-and-drop.component';
import { ProjectLocationUpdateModalComponent } from './locations/update/project-location-update-modal.component';
import { ProjectMemberInviteModalComponent } from './member/project-member-invite-modal.component';
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
        resolve: { project: projectFromParentRoute },
      },
      {
        path: 'locations',
        component: ProjectLocationsDragAndDropComponent,
        resolve: { project: projectFromParentRoute },
        children: [
          {
            path: 'project/:projectId/locations/new',
            component: ProjectLocationUpdateModalComponent,
            outlet: 'modal',
            pathMatch: 'full',
            resolve: {
              location: locationById,
              project: projectById,
            },
          },
          {
            path: 'project/:projectId/locations/:id/new',
            component: ProjectLocationUpdateModalComponent,
            outlet: 'modal',
            pathMatch: 'full',
            resolve: {
              location: locationById,
              project: projectById,
            },
          },
        ],
      },
      {
        path: 'members',
        component: ProjectMemberListComponent,
        data: {
          [DEFAULT_SORT_DATA]: 'acceptedDate,desc',
        },
        resolve: { project: projectFromParentRoute },
        children: [
          {
            path: 'project/:projectId/members/invite',
            component: ProjectMemberInviteModalComponent,
            outlet: 'modal',
            pathMatch: 'full',
            resolve: {
              project: projectById,
            },
          },
        ],
      },
    ],
    resolve: { project: projectFromParentRoute },
  },
];
