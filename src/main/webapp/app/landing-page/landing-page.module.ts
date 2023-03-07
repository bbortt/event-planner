import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { LANDING_PAGE_ROUTES } from './landing-page.route';

import { LandingPageComponent } from './landing-page.component';

@NgModule({
  imports: [SharedModule, RouterModule.forRoot(LANDING_PAGE_ROUTES)],
  declarations: [LandingPageComponent],
})
export class LandingPageModule {}
