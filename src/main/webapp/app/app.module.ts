import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import './vendor';
import { EventPlannerSharedModule } from 'app/shared/shared.module';
import { EventPlannerCoreModule } from 'app/core/core.module';
import { EventPlannerAppRoutingModule } from './app-routing.module';
import { EventPlannerEntityModule } from './entities/entity.module';
import { EventPlannerViewModule } from './view/view.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    EventPlannerSharedModule,
    EventPlannerCoreModule,
    EventPlannerViewModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    EventPlannerEntityModule,
    EventPlannerAppRoutingModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent],
})
export class EventPlannerAppModule {}
