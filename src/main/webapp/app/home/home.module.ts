import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { HOME_ROUTES } from './home.route';

import { HomeComponent } from './home.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(HOME_ROUTES)],
  declarations: [HomeComponent],
})
export class HomeModule {}
