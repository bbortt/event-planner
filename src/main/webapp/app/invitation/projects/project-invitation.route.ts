import { Route } from '@angular/router';

import { ProjectInvitationComponent } from './project-invitation.component';
import { ProjectTokenRoutingResolveService } from './route/project-token-routing-resolve.service';

export const PROJECT_INVITATION_ROUTES: Route[] = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: ':token',
    component: ProjectInvitationComponent,
    resolve: {
      project: ProjectTokenRoutingResolveService,
    },
  },
];
