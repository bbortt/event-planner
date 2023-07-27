import { Route } from '@angular/router';

import { projectByToken } from 'app/entities/project/route/project-resolve.service';

import ProjectInvitationComponent from './project-invitation.component';

const projectInvitationRoutes: Route[] = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: ':token',
    component: ProjectInvitationComponent,
    resolve: {
      project: projectByToken,
    },
  },
];

export default projectInvitationRoutes;
