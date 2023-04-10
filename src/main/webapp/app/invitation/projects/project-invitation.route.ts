import { Route } from '@angular/router';

import { ProjectInvitationComponent } from './project-invitation.component';

export const PROJECT_INVITATION_ROUTES: Route[] = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: ':id',
    component: ProjectInvitationComponent,
  },
];
