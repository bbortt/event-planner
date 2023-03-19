import { Route } from '@angular/router';

import { HomeComponent } from './home.component';

export const HOME_ROUTES: Route[] = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'projects',
    loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
  },
];
