import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DragulaModule } from 'ng2-dragula';

import { ProjectEntityModule } from 'app/entities/project/project-entity.module';

import { SharedModule } from 'app/shared/shared.module';

import { PROJECT_ADMIN_ROUTES } from './project-admin.route';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { SideNavComponent } from './layout/side-nav.component';

import { ProjectEventListComponent } from './events/project-event-list.component';

import { ProjectLocationsDragAndDropComponent } from './locations/project-locations-drag-and-drop.component';
import { ProjectLocationDragComponent } from './locations/project-location-drag.component';
import { ProjectLocationUpdateComponent } from './locations/update/project-location-update.component';
import { ProjectLocationUpdateModalComponent } from './locations/update/project-location-update-modal.component';

import {
  ProjectMemberInviteModalComponent,
  ProjectMemberInviteModalContentComponent,
} from './members/project-member-invite-modal.component';
import { ProjectMemberListComponent } from './members/project-member-list.component';

import { ProjectSettingsComponent } from './settings/project-settings.component';

@NgModule({
  imports: [DragulaModule.forRoot(), SharedModule, ProjectEntityModule, RouterModule.forChild(PROJECT_ADMIN_ROUTES)],
  declarations: [
    AdminLayoutComponent,
    ProjectEventListComponent,
    ProjectLocationsDragAndDropComponent,
    ProjectLocationDragComponent,
    ProjectLocationUpdateComponent,
    ProjectLocationUpdateModalComponent,
    ProjectMemberInviteModalComponent,
    ProjectMemberInviteModalContentComponent,
    ProjectMemberListComponent,
    ProjectSettingsComponent,
    SideNavComponent,
  ],
})
export class ProjectAdminModule {}
