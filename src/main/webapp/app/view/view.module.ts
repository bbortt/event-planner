import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from '../shared/shared.module';
import { VIEW_ROUTE } from './view.route';
import { HomeComponent } from './home/home.component';
import { MyProjectsComponent } from 'app/view/my-projects/my-projects.component';

@NgModule({
  imports: [EventPlannerSharedModule, RouterModule.forChild([VIEW_ROUTE])],
  declarations: [HomeComponent, MyProjectsComponent],
})
export class EventPlannerViewModule {}
