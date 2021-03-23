import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { PROJECT_ROUTES } from './project.routes';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(PROJECT_ROUTES)],
  declarations: [],
})
export class EventPlannerProjectModule {}
