import { Routes } from '@angular/router';

import { ResponsibilityResolve } from 'app/entities/responsibility/responsibility.route';

import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';
import { ResponsibilityModalComponent } from 'app/view/project/admin/responsibilities/responsibility-modal.component';
import { ProjectResolve } from 'app/entities/project/project.route';

export const MODAL_OUTLET_ROUTES: Routes = [
  {
    path: 'projects/new',
    component: CreateProjectModalComponent,
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/responsibilities/new',
    component: ResponsibilityModalComponent,
    resolve: {
      project: ProjectResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/responsibilities/:id/edit',
    component: ResponsibilityModalComponent,
    resolve: {
      project: ProjectResolve,
      responsibility: ResponsibilityResolve,
    },
    outlet: 'modal',
  },
];
