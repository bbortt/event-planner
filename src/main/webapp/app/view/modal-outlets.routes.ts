import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.route';
import { ResponsibilityResolve } from 'app/entities/responsibility/responsibility.route';

import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';
import { ProjectResponsibilityModalComponent } from 'app/view/project/admin/responsibilities/project-responsibility-modal.component';

export const MODAL_OUTLET_ROUTES: Routes = [
  {
    path: 'projects/create',
    component: CreateProjectModalComponent,
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/responsibilities/new',
    component: ProjectResponsibilityModalComponent,
    resolve: {
      project: ProjectResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/responsibilities/:id/edit',
    component: ProjectResponsibilityModalComponent,
    resolve: {
      project: ProjectResolve,
      responsibility: ResponsibilityResolve,
    },
    outlet: 'modal',
  },
];
