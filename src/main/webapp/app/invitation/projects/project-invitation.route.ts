import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { ProjectInvitationComponent } from './project-invitation.component';
import { projectByToken } from './route/resolve-project-by-token';

export const PROJECT_INVITATION_ROUTES: Route[] = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: ':token',
    component: ProjectInvitationComponent,
    resolve: {
      project: inject(projectByToken),
    },
  },
];
