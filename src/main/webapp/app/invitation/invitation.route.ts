import { Route } from '@angular/router';

export const INVITATION_ROUTES: Route[] = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: 'projects',
    loadChildren: () => import('./projects/project-invitation.routes'),
  },
];
