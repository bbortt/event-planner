import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';

import { MODAL_OUTLET_ROUTES } from 'app/view/modal-outlets.routes';

export const VIEW_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      pageTitle: 'home.title',
    },
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then(m => m.EventPlannerProjectModule),
  },
  ...MODAL_OUTLET_ROUTES,
];
