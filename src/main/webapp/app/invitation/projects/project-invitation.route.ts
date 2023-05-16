import { Route } from '@angular/router';

import { projectByToken } from 'app/entities/project/route/project-resolve.service';

import { ProjectInvitationComponent } from './project-invitation.component';

export const PROJECT_INVITATION_ROUTES: Route[] = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: ':token',
    component: ProjectInvitationComponent,
    resolve: {
      project: projectByToken,
    },
  },
];
