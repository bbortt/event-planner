import { Routes } from '@angular/router';

import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';

export const MODAL_OUTLET_ROUTES: Routes = [
  {
    path: 'projects/create',
    component: CreateProjectModalComponent,
    outlet: 'modal',
  },
];
