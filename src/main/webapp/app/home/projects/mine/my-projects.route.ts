import { Route } from '@angular/router';

import { ProjectCreateModalComponent } from './project-create-modal.component';
import { MyProjectsListComponent } from './my-projects-list.component';

export const MY_PROJECTS_ROUTES: Route[] = [
  {
    path: '',
    component: MyProjectsListComponent,
  },
  {
    path: 'projects/new',
    component: ProjectCreateModalComponent,
    outlet: 'modal',
  },
];
