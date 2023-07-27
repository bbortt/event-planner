import { Route } from '@angular/router';

import HomeComponent from './home.component';

const homeRoutes: Route[] = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'projects',
    loadChildren: () => import('./projects/projects.routes'),
  },
];

export default homeRoutes;
