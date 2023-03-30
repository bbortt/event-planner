import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { PROJECT_ADMIN_ROUTES } from './project-admin.route';

import { ProjectEntityModule } from '../../../entities/project/project-entity.module';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { SideNavComponent } from './layout/side-nav.component';
import {
  ProjectMemberInviteModalComponent,
  ProjectMemberInviteModalContentComponent,
} from './member/project-member-invite-modal.component';
import { ProjectMemberListComponent } from './member/project-member-list.component';
import { ProjectSettingsComponent } from './settings/project-settings.component';

@NgModule({
  imports: [SharedModule, ProjectEntityModule, RouterModule.forChild(PROJECT_ADMIN_ROUTES)],
  declarations: [
    AdminLayoutComponent,
    ProjectMemberInviteModalComponent,
    ProjectMemberInviteModalContentComponent,
    ProjectMemberListComponent,
    ProjectSettingsComponent,
    SideNavComponent,
  ],
})
export class ProjectAdminModule {}
