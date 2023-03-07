import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';

import { ProjectEntityModule } from './project-entity.module';
import { ProjectRoutingModule } from './route/project-routing.module';

@NgModule({
  imports: [SharedModule, ProjectEntityModule, ProjectRoutingModule],
})
export class ProjectModule {}
