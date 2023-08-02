import { Route } from '@angular/router';

import { DEFAULT_SORT_DATA } from 'app/config/navigation.constants';

import { eventById } from '../../../entities/event/route/event-resolve.service';
import { locationById } from 'app/entities/location/route/location-resolve.service';
import { projectById } from 'app/entities/project/route/project-resolve.service';

import { projectFromParentRoute } from './route/project-from-parent.resolve';

import AdminLayoutComponent from './layout/admin-layout.component';

import ProjectEventListComponent from './events/project-event-list.component';
import ProjectEventUpdateModalComponent from './events/update/project-event-update-modal.component';
import ProjectLocationsDragAndDropComponent from './locations/project-locations-drag-and-drop.component';
import ProjectLocationUpdateModalComponent from './locations/update/project-location-update-modal.component';
import ProjectMemberInviteModalComponent from './members/project-member-invite-modal.component';
import ProjectMemberListComponent from './members/project-member-list.component';
import ProjectSettingsComponent from './settings/project-settings.component';

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
              project: projectById,
            },
          },
          {
            path: 'project/:projectId/locations/:locationId/new',
            component: ProjectLocationUpdateModalComponent,
            outlet: 'modal',
            pathMatch: 'full',
            resolve: {
              location: locationById,
              project: projectById,
            },
          },
          {
            path: 'project/:projectId/locations/:locationId/edit',
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
        path: 'events',
        component: ProjectEventListComponent,
        data: {
          [DEFAULT_SORT_DATA]: 'createdDate,desc',
        },
        resolve: { project: projectFromParentRoute },
        children: [
          {
            path: 'project/:projectId/events/new',
            component: ProjectEventUpdateModalComponent,
            outlet: 'modal',
            pathMatch: 'full',
          },
          {
            path: 'project/:projectId/events/:eventId/new',
            component: ProjectEventUpdateModalComponent,
            outlet: 'modal',
            pathMatch: 'full',
            resolve: {
              event: eventById,
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
