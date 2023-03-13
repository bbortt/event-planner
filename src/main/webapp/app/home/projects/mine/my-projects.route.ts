import { Route } from '@angular/router';

import { MyProjectsListComponent } from './my-projects-list.component';
import { ProjectCreateModalComponent } from './project-create-modal.component';
import { DEFAULT_SORT_DATA } from '../../../config/navigation.constants';

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
