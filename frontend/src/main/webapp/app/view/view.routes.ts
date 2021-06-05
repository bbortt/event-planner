import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { AcceptInvitationComponent } from 'app/view/invitation/accept-invitation.component';

import { MODAL_OUTLET_ROUTES } from 'app/view/modal-outlet.routes';

export const VIEW_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      pageTitle: 'home.title',
    },
  },
  {
    path: 'invitation/login/:token',
    component: AcceptInvitationComponent,
    data: {
      variant: 'login',
    },
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then(m => m.EventPlannerProjectModule),
  },
  ...MODAL_OUTLET_ROUTES,
];
