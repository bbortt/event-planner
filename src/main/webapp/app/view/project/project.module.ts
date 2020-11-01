import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from 'app/shared/shared.module';

import { ScreenplayComponent } from 'app/view/project/screenplay/screenplay.component';

import { PROJECT_ROUTES } from './project.routes';

@NgModule({
  imports: [EventPlannerSharedModule, RouterModule.forChild(PROJECT_ROUTES)],
  declarations: [ScreenplayComponent],
})
export class EventPlannerProjectModule {}
