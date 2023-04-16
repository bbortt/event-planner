import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { PROJECT_INVITATION_ROUTES } from './project-invitation.route';

import { ProjectInvitationComponent } from './project-invitation.component';
import { ProjectInvitationAcceptComponent } from './project-invitation-accept.component';
import { ProjectInvitationLoginComponent } from './project-invitation-login.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(PROJECT_INVITATION_ROUTES)],
  declarations: [ProjectInvitationComponent, ProjectInvitationAcceptComponent, ProjectInvitationLoginComponent],
})
export class ProjectInvitationModule {}
