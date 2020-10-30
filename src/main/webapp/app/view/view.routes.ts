import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';

export const VIEW_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      defaultSort: 'id,asc',
      pageTitle: 'home.title',
    },
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then(m => m.EventPlannerProjectModule),
  },
  {
    path: 'create-project',
    component: CreateProjectModalComponent,
    outlet: 'modal',
  },
];
