import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EventPlannerSharedModule } from 'app/shared/shared.module';
import { EventPlannerCoreModule } from 'app/core/core.module';
import { EventPlannerAppRoutingModule } from './app-routing.module';
import { EventPlannerViewModule } from './view/view.module';
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';

import './vendor';

// jhipster-needle-angular-add-module-import JHipster will add new module here

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    EventPlannerSharedModule,
    EventPlannerCoreModule,
    EventPlannerViewModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    EventPlannerAppRoutingModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent],
})
export class EventPlannerAppModule {}
