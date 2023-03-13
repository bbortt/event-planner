import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { ProjectEntityModule } from '../../entities/project/project-entity.module';

import { MY_PROJECTS_ROUTES } from './projects.route';

@NgModule({
  imports: [SharedModule, ProjectEntityModule, RouterModule.forChild(MY_PROJECTS_ROUTES)],
})
export class ProjectsModule {}
