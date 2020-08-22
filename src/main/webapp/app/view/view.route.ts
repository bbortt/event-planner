import { Route } from '@angular/router';

import { HomeComponent } from './home/home.component';

export const VIEW_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    defaultSort: 'id,asc',
    pageTitle: 'home.title',
  },
};
