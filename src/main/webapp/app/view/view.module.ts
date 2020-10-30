import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from '../shared/shared.module';
import { ProjectComponentModule } from 'app/entities/project/project-component.module';

import { HomeComponent } from './home.component';
import { MyProjectsComponent } from 'app/view/project/my-projects/my-projects.component';
import { CreateProjectModalComponent } from 'app/view/project/create-project/create-project-modal.component';

import { VIEW_ROUTES } from './view.routes';

@NgModule({
  imports: [EventPlannerSharedModule, ProjectComponentModule, RouterModule.forChild(VIEW_ROUTES)],
  declarations: [HomeComponent, MyProjectsComponent, CreateProjectModalComponent],
  entryComponents: [HomeComponent],
})
export class EventPlannerViewModule {}
