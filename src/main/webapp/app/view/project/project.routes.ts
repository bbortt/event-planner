import { Routes } from '@angular/router';

import { ProjectComponent } from './project.component';

export const PROJECT_ROUTES: Routes = [
  {
    path: ':id',
    component: ProjectComponent,
    data: {
      defaultSort: 'id,asc',
      pageTitle: 'eventPlannerApp.project.overview.tabTitle',
    },
  },
];
