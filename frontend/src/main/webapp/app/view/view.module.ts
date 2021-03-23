import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { DxAutocompleteModule, DxDateBoxModule } from 'devextreme-angular';

import { HomeComponent } from './home.component';
import { MyProjectsComponent } from 'app/view/my-projects/my-projects.component';

import { ProjectCreateComponent } from 'app/view/create-project/project-create.component';
import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';
import { ProjectResponsibilityModalComponent } from 'app/view/project/admin/responsibilities/project-responsibility-modal.component';
import { ProjectUserInviteModalComponent } from 'app/view/project/admin/users/project-user-invite-modal.component';

import { AcceptInvitationComponent } from 'app/view/invitation/accept-invitation.component';

import { VIEW_ROUTES } from './view.routes';

@NgModule({
  imports: [SharedModule, DxAutocompleteModule, DxDateBoxModule, RouterModule.forChild(VIEW_ROUTES)],
  declarations: [
    HomeComponent,
    MyProjectsComponent,
    ProjectCreateComponent,
    CreateProjectModalComponent,
    ProjectResponsibilityModalComponent,
    ProjectUserInviteModalComponent,
    AcceptInvitationComponent,
  ],
  entryComponents: [HomeComponent],
})
export class ViewModule {}
