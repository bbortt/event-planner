import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/de';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';

import { LangChangeEvent, MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { locale as dxLocale } from 'devextreme/localization';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { NgxWebstorageModule, SessionStorageService } from 'ngx-webstorage';

import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from 'app/shared/shared.module';

import { ErrorComponent } from './layouts/error/error.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';

import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { httpInterceptorProviders } from 'app/core/interceptor/index';

import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { missingTranslationHandler, translatePartialLoader } from './config/translation.config';

import { SERVER_API_URL } from './app.constants';

import './config/dayjs';
import * as dayjs from 'dayjs';

import './vendor';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    HomeModule,
    AppRoutingModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translatePartialLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useFactory: missingTranslationHandler,
      },
    }),
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'de' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent],
})
export class AppModule {
  constructor(
    applicationConfigService: ApplicationConfigService,
    iconLibrary: FaIconLibrary,
    dpConfig: NgbDatepickerConfig,
    translateService: TranslateService,
    sessionStorageService: SessionStorageService
  ) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };

    dxLocale('de');
    translateService.setDefaultLang('de');
    translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      dxLocale(event.lang);
    });

    // if user have changed language and navigates away from the application and back to the application then use previously choosed language
    const langKey = sessionStorageService.retrieve('locale') ?? 'de';
    translateService.use(langKey);
  }
}
