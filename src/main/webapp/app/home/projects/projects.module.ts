import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { MY_PROJECTS_ROUTES } from './projects.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(MY_PROJECTS_ROUTES)],
})
export class ProjectsModule {}
