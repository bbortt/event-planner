import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from '../shared/shared.module';

import { DxDateBoxModule } from 'devextreme-angular';

import { NgxAutocompleteModule } from '@bbortt/ngx-autocomplete';

import { HomeComponent } from './home.component';
import { MyProjectsComponent } from 'app/view/my-projects/my-projects.component';

import { ProjectCreateComponent } from 'app/view/create-project/project-create.component';
import { CreateProjectModalComponent } from 'app/view/create-project/create-project-modal.component';
import { ProjectResponsibilityModalComponent } from 'app/view/project/admin/responsibilities/project-responsibility-modal.component';

import { ProjectUserModalComponent } from 'app/view/project/admin/users/project-user-modal.component';
import { VIEW_ROUTES } from './view.routes';

@NgModule({
  imports: [EventPlannerSharedModule, DxDateBoxModule, NgxAutocompleteModule, RouterModule.forChild(VIEW_ROUTES)],
  declarations: [
    HomeComponent,
    MyProjectsComponent,
    ProjectCreateComponent,
    CreateProjectModalComponent,
    ProjectResponsibilityModalComponent,
    ProjectUserModalComponent,
  ],
  entryComponents: [HomeComponent],
})
export class EventPlannerViewModule {}
