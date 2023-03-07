import { Route } from '@angular/router';

import { DEFAULT_SORT_DATA } from '../config/navigation.constants';

import { HomeComponent } from './home.component';

export const HOME_ROUTES: Route[] = [
  {
    path: '',
    component: HomeComponent,
    data: {
      pageTitle: 'home.title',
      [DEFAULT_SORT_DATA]: 'createdDate',
    },
  },
];
