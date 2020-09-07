import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CreateProjectModalComponent } from 'app/view/my-projects/create-project/create-project-modal.component';

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
    path: 'create-project',
    component: CreateProjectModalComponent,
    outlet: 'modal',
  },
];
