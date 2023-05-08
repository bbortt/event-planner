import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DragulaModule } from 'ng2-dragula';

import { ProjectEntityModule } from 'app/entities/project/project-entity.module';

import { SharedModule } from 'app/shared/shared.module';

import { PROJECT_ADMIN_ROUTES } from './project-admin.route';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { SideNavComponent } from './layout/side-nav.component';

import { ProjectLocationsComponent } from './locations/project-locations.component';
import { ProjectLocationDragComponent } from './locations/project-location-drag.component';

import {
  ProjectMemberInviteModalComponent,
  ProjectMemberInviteModalContentComponent,
} from './member/project-member-invite-modal.component';
import { ProjectMemberListComponent } from './member/project-member-list.component';

import { ProjectSettingsComponent } from './settings/project-settings.component';

@NgModule({
  imports: [DragulaModule.forRoot(), SharedModule, ProjectEntityModule, RouterModule.forChild(PROJECT_ADMIN_ROUTES)],
  declarations: [
    AdminLayoutComponent,
    ProjectLocationsComponent,
    ProjectLocationDragComponent,
    ProjectMemberInviteModalComponent,
    ProjectMemberInviteModalContentComponent,
    ProjectMemberListComponent,
    ProjectSettingsComponent,
    SideNavComponent,
  ],
})
export class ProjectAdminModule {}
