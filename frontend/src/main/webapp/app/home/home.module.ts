import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ViewModule } from '../view/view.module';

import { HomeComponent } from './home.component';

import { HOME_ROUTE } from './home.route';

@NgModule({
  imports: [SharedModule, ViewModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent],
})
export class HomeModule {}
