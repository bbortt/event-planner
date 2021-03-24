import { NgModule } from '@angular/core';

import { ComponentsModule } from 'app/shared/components/components.module';
import { SharedLibsModule } from './shared-libs.module';

import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { ItemCountComponent } from './pagination/item-count.component';

import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import {HasAnyRoleDirective} from 'app/shared/auth/has-any-role.directive';
import { SortByDirective } from './sort/sort-by.directive';
import { SortDirective } from './sort/sort.directive';
import { TranslateDirective } from './language/translate.directive';

import { DurationPipe } from './date/duration.pipe';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { FormatMediumDatetimePipe } from './date/format-medium-datetime.pipe';
import { FormatMediumDatePipe } from './date/format-medium-date.pipe';
import { I18nRolePipe } from 'app/shared/util/i18n-role.pipe';

@NgModule({
  imports: [SharedLibsModule, ComponentsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    I18nRolePipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    HasAnyRoleDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
  ],
  exports: [
    SharedLibsModule,
    FindLanguageFromKeyPipe,
    I18nRolePipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    HasAnyRoleDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    ComponentsModule,
  ],
})
export class SharedModule {}
