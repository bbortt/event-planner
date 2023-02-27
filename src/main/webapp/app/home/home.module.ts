import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { HOME_ROUTES } from './home.route';

import { HomeComponent } from './home.component';
import { LandingPageComponent } from './anonymous/landing-page.component';
import { MyProjectsListComponent } from './my-projects-list.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(HOME_ROUTES)],
  declarations: [HomeComponent, LandingPageComponent, MyProjectsListComponent],
})
export class HomeModule {}
