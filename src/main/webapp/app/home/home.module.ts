import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { MyProjectsModule } from './my-projects/my-projects.module';

import { HOME_ROUTES } from './home.route';

import { HomeComponent } from './home.component';

@NgModule({
  imports: [SharedModule, MyProjectsModule, RouterModule.forChild(HOME_ROUTES)],
  declarations: [HomeComponent],
})
export class HomeModule {}
