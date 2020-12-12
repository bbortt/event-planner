import { Routes } from '@angular/router';
import { ProjectResolve } from 'app/entities/project/project.resolve';
import { ResponsibilityResolve } from 'app/entities/responsibility/responsibility.resolve';
import { LocationResolve } from 'app/entities/location/location.resolve';
import { SectionResolve } from 'app/entities/section/section.resolve';

import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';
import { ProjectResponsibilityModalComponent } from 'app/view/project/admin/responsibilities/project-responsibility-modal.component';
import { ProjectUserModalComponent } from 'app/view/project/admin/users/project-user-modal.component';
import { ProjectLocationModalComponent } from 'app/view/project/admin/locations/project-location-modal.component';
import { ProjectSectionModalComponent } from 'app/view/project/admin/locations/sections/project-section-modal.component';

import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';
import { ADMIN, SECRETARY } from 'app/shared/constants/role.constants';

export const MODAL_OUTLET_ROUTES: Routes = [
  {
    path: 'projects/new',
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
    path: 'projects/:projectId/responsibilities/:responsibilityId/edit',
    component: ProjectResponsibilityModalComponent,
    resolve: {
      project: ProjectResolve,
      responsibility: ResponsibilityResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/users/invite',
    component: ProjectUserModalComponent,
    resolve: {
      project: ProjectResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/locations/new',
    component: ProjectLocationModalComponent,
    resolve: {
      project: ProjectResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/locations/:locationId/edit',
    component: ProjectLocationModalComponent,
    resolve: {
      project: ProjectResolve,
      location: LocationResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/locations/:locationId/sections/new',
    component: ProjectSectionModalComponent,
    data: {
      roles: [ADMIN.name, SECRETARY.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      location: LocationResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/locations/:locationId/sections/:sectionId/edit',
    component: ProjectSectionModalComponent,
    data: {
      roles: [ADMIN.name, SECRETARY.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      location: LocationResolve,
      section: SectionResolve,
    },
    outlet: 'modal',
  },
];
