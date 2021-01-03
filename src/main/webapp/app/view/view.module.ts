import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from '../shared/shared.module';

import { DxAutocompleteModule, DxDateBoxModule } from 'devextreme-angular';

import { HomeComponent } from './home.component';
import { MyProjectsComponent } from 'app/view/my-projects/my-projects.component';

import { ProjectCreateComponent } from 'app/view/create-project/project-create.component';
import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';
import { ProjectResponsibilityModalComponent } from 'app/view/project/admin/responsibilities/project-responsibility-modal.component';
import { ProjectUserModalComponent } from 'app/view/project/admin/users/project-user-modal.component';

import { VIEW_ROUTES } from './view.routes';
import { AcceptInvitationComponent } from 'app/view/invitation/accept-invitation.component';

@NgModule({
  imports: [EventPlannerSharedModule, DxAutocompleteModule, DxDateBoxModule, RouterModule.forChild(VIEW_ROUTES)],
  declarations: [
    HomeComponent,
    MyProjectsComponent,
    ProjectCreateComponent,
    CreateProjectModalComponent,
    ProjectResponsibilityModalComponent,
    ProjectUserModalComponent,
    AcceptInvitationComponent,
  ],
  entryComponents: [HomeComponent],
})
export class EventPlannerViewModule {}
