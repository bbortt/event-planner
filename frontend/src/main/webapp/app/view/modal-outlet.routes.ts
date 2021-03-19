import { Routes } from '@angular/router';

import { EventResolve } from 'app/entities/event/event.resolve';
import { InvitationResolve } from 'app/entities/invitation/invitation.resolve';
import { LocationResolve } from 'app/entities/location/location.resolve';
import { ProjectResolve } from 'app/entities/project/project.resolve';
import { ResponsibilityResolve } from 'app/entities/responsibility/responsibility.resolve';
import { SectionResolve } from 'app/entities/section/section.resolve';

import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';
import { ProjectAdminUpdateModalComponent } from 'app/view/project/admin/project-admin-update-modal.component';
import { ProjectResponsibilityModalComponent } from 'app/view/project/admin/responsibilities/project-responsibility-modal.component';
import { ProjectUserInviteModalComponent } from 'app/view/project/admin/users/project-user-invite-modal.component';
import { ProjectLocationModalComponent } from 'app/view/project/admin/locations/project-location-modal.component';
import { ProjectSectionModalComponent } from 'app/view/project/admin/locations/sections/project-section-modal.component';
import { EventUpdateModalComponent } from 'app/view/project/screenplay/event/event-update-modal.component';

import { Role } from 'app/shared/constants/role.constants';

export const MODAL_OUTLET_ROUTES: Routes = [
  {
    path: 'projects/new',
    component: CreateProjectModalComponent,
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/edit',
    component: ProjectAdminUpdateModalComponent,
    data: {
      roles: [Role.ADMIN.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/responsibilities/new',
    component: ProjectResponsibilityModalComponent,
    data: {
      roles: [Role.ADMIN.name, Role.SECRETARY.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/responsibilities/:responsibilityId/edit',
    component: ProjectResponsibilityModalComponent,
    data: {
      roles: [Role.ADMIN.name, Role.SECRETARY.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
      responsibility: ResponsibilityResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/users/invite/new',
    component: ProjectUserInviteModalComponent,
    data: {
      roles: [Role.ADMIN.name, Role.SECRETARY.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/users/invite/:invitationId/edit',
    component: ProjectUserInviteModalComponent,
    data: {
      roles: [Role.ADMIN.name, Role.SECRETARY.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
      invitation: InvitationResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/locations/new',
    component: ProjectLocationModalComponent,
    data: {
      roles: [Role.ADMIN.name, Role.SECRETARY.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/locations/:locationId/edit',
    component: ProjectLocationModalComponent,
    data: {
      roles: [Role.ADMIN.name, Role.SECRETARY.name],
    },
    canActivate: [UserRouteRoleAccessService],
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
      roles: [Role.ADMIN.name, Role.SECRETARY.name],
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
      roles: [Role.ADMIN.name, Role.SECRETARY.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      location: LocationResolve,
      section: SectionResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/locations/:locationId/sections/:sectionId/events/new',
    component: EventUpdateModalComponent,
    data: {
      roles: [Role.ADMIN.name, Role.SECRETARY.name, Role.CONTRIBUTOR.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
      location: LocationResolve,
      section: SectionResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/locations/:locationId/sections/:sectionId/events/:eventId',
    component: EventUpdateModalComponent,
    data: {
      roles: [Role.ADMIN.name, Role.SECRETARY.name, Role.CONTRIBUTOR.name, Role.VIEWER.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
      location: LocationResolve,
      section: SectionResolve,
      event: EventResolve,
    },
    outlet: 'modal',
  },
  {
    path: 'projects/:projectId/locations/:locationId/sections/:sectionId/events/:eventId/edit',
    component: EventUpdateModalComponent,
    data: {
      roles: [Role.ADMIN.name, Role.SECRETARY.name, Role.CONTRIBUTOR.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
      location: LocationResolve,
      section: SectionResolve,
      event: EventResolve,
    },
    outlet: 'modal',
  },
];
