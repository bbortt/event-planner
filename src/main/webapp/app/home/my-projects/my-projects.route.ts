import { Route } from '@angular/router';

import { ProjectCreateModalComponent } from './project-create-modal.component';

export const MY_PROJECTS_ROUTES: Route[] = [
  {
    path: 'project/new',
    component: ProjectCreateModalComponent,
    outlet: 'modal',
  },
];
