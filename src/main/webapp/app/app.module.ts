import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/de';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import dayjs from 'dayjs/esm';
import './config/dayjs';

import { AppRoutingModule } from './app-routing.module';

import { Configuration } from './api';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { httpInterceptorProviders } from 'app/core/interceptor';
import { TranslationModule } from 'app/shared/language/translation.module';
import SharedModule from 'app/shared/shared.module';

import { ApiConfiguration } from './config/api-configuration';
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';

import { TrackerService } from './core/tracker/tracker.service';

import MainComponent from './layouts/main/main.component';
import MainModule from './layouts/main/main.module';

// jhipster-needle-angular-add-module-import JHipster will add new module here

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    AppRoutingModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    MainModule,
    TranslationModule,
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'de' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
    { provide: Configuration, useClass: ApiConfiguration },
  ],
  bootstrap: [MainComponent],
})
export class AppModule {
  constructor(
    applicationConfigService: ApplicationConfigService,
    iconLibrary: FaIconLibrary,
    trackerService: TrackerService,
    dpConfig: NgbDatepickerConfig
  ) {
    trackerService.setup();
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
  }
}
