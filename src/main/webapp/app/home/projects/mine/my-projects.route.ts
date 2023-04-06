import { Route } from '@angular/router';

import { DEFAULT_SORT_DATA } from 'app/config/navigation.constants';

import { MyProjectsListComponent } from './my-projects-list.component';
import { ProjectCreateModalComponent } from './project-create-modal.component';

export const MY_PROJECTS_ROUTES: Route[] = [
  {
    path: '',
    component: MyProjectsListComponent,
    data: {
      pageTitle: 'home.title',
      [DEFAULT_SORT_DATA]: 'startDate,asc',
    },
  },
  {
    path: 'project/new',
    component: ProjectCreateModalComponent,
    outlet: 'modal',
    pathMatch: 'full',
  },
];
