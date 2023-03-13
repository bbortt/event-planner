import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { MY_PROJECTS_ROUTES } from './my-projects.route';

import { ProjectEntityModule } from '../../../entities/project/project-entity.module';

import { MyProjectsListComponent } from './my-projects-list.component';
import { ProjectCardComponent } from './project-card.component';
import { ProjectCreateModalComponent, ProjectCreateModalContentComponent } from './project-create-modal.component';

@NgModule({
  imports: [SharedModule, ProjectEntityModule, RouterModule.forChild(MY_PROJECTS_ROUTES)],
  exports: [MyProjectsListComponent],
  declarations: [MyProjectsListComponent, ProjectCardComponent, ProjectCreateModalComponent, ProjectCreateModalContentComponent],
})
export class MyProjectsModule {}
