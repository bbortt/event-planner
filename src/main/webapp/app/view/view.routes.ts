import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';

import { MODAL_OUTLET_ROUTES } from 'app/view/modal-outlet.routes';
import { InvitationViaLoginComponent } from 'app/view/invitation/invitation-via-login.component';
import { InvitationViaRegisterComponent } from 'app/view/invitation/invitation-via-register.component';

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
    component: InvitationViaLoginComponent,
    data: {
      authorities: [],
    },
  },
  {
    path: 'invitation/register/:token',
    component: InvitationViaRegisterComponent,
    data: {
      authorities: [],
    },
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then(m => m.EventPlannerProjectModule),
  },
  ...MODAL_OUTLET_ROUTES,
];
