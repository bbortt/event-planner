import { Routes } from '@angular/router';

import { ResponsibilityResolve } from 'app/entities/responsibility/responsibility.route';

import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';
import { ResponsibilityModalComponent } from 'app/view/project/admin/responsibilities/responsibility-modal.component';

export const MODAL_OUTLET_ROUTES: Routes = [
  {
    path: 'projects/new',
    component: CreateProjectModalComponent,
    outlet: 'modal',
  },
  {
    path: 'responsibilities/new',
    component: ResponsibilityModalComponent,
    outlet: 'modal',
  },
  {
    path: 'responsibilities/:id/edit',
    component: ResponsibilityModalComponent,
    resolve: {
      responsibility: ResponsibilityResolve,
    },
    outlet: 'modal',
  },
];
