import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.route';

import { ScreenplayComponent } from 'app/view/project/screenplay/screenplay.component';

export const PROJECT_ROUTES: Routes = [
  {
    path: ':id',
    pathMatch: 'full',
    redirectTo: ':id/admin',
  },
  {
    path: ':id/admin',
    loadChildren: () => import('./admin/project-admin.module').then(m => m.EventPlannerProjectAdminModule),
  },
  {
    path: ':id/screenplay',
    component: ScreenplayComponent,
    data: {
      pageTitle: 'eventPlannerApp.project.screenplay.tabTitle',
    },
    resolve: {
      project: ProjectResolve,
    },
  },
];
