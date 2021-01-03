import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { JhiConfigService, JhiLanguageService } from 'ng-jhipster';

import { locale as dxLocale } from 'devextreme/localization';

/**
 * Custom language service registered in `core.module.ts`. Listens on language (-key) changes and
 * immediately applies the selected language to `devextreme`. Make sure to import the `devextreme`
 * language packages for new ones in `vendor.ts`
 */
@Injectable({
  providedIn: 'root',
})
export class AppLanguageService extends JhiLanguageService {
  constructor(translateService: TranslateService, configService: JhiConfigService) {
    super(translateService, configService);
  }

  public changeLanguage(languageKey: string): void {
    super.changeLanguage(languageKey);
    dxLocale(languageKey);
  }
}
