import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { EventPlannerSharedModule } from 'app/shared/shared.module';
import { EventPlannerCoreModule } from 'app/core/core.module';
import { EventPlannerAppRoutingModule } from './app-routing.module';
import { EventPlannerViewModule } from 'app/view/view.module';

import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';

import './vendor';

@NgModule({
  imports: [BrowserModule, EventPlannerSharedModule, EventPlannerCoreModule, EventPlannerViewModule, EventPlannerAppRoutingModule],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent],
})
export class EventPlannerAppModule {}
