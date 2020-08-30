import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { projectRoute } from './project.route';

import { EventPlannerSharedModule } from 'app/shared/shared.module';
import { ProjectComponentModule } from './project-component.module';

@NgModule({
  imports: [EventPlannerSharedModule, ProjectComponentModule, RouterModule.forChild(projectRoute)],
})
export class EventPlannerProjectModule {}
