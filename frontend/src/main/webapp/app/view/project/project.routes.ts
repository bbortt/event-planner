import { Routes } from '@angular/router';

export const PROJECT_ROUTES: Routes = [
  {
    path: ':projectId',
    pathMatch: 'full',
    redirectTo: ':projectId/admin',
  },
  {
    path: ':projectId/admin',
    loadChildren: () => import('./admin/project-admin.module').then(m => m.EventPlannerProjectAdminModule),
  },
  {
    path: ':projectId/calendar',
    loadChildren: () => import('./calendar/project-calendar.module').then(m => m.EventPlannerProjectCalendarModule),
  },
];
