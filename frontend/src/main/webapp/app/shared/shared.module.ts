import { NgModule } from '@angular/core';
import { EventPlannerSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { ComponentsModule } from 'app/shared/components/components.module';
import { I18nRolePipe } from 'app/shared/util/i18n-role.pipe';
import { HasAnyRoleDirective } from 'app/shared/auth/has-any-role.directive';

@NgModule({
  imports: [ComponentsModule, EventPlannerSharedLibsModule],
  declarations: [FindLanguageFromKeyPipe, I18nRolePipe, AlertComponent, AlertErrorComponent, HasAnyAuthorityDirective, HasAnyRoleDirective],
  exports: [
    EventPlannerSharedLibsModule,
    FindLanguageFromKeyPipe,
    I18nRolePipe,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    HasAnyRoleDirective,
    ComponentsModule,
  ],
})
export class EventPlannerSharedModule {}
