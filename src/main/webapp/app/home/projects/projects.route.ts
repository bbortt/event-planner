import { Route } from '@angular/router';

import { DEFAULT_SORT_DATA } from '../../config/navigation.constants';

export const MY_PROJECTS_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => import('./mine/my-projects.module').then(m => m.MyProjectsModule),
  },
];
