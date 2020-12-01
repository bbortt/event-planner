import { NgModule } from '@angular/core';
import { EventPlannerSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { LoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { ComponentsModule } from 'app/shared/components/components.module';
import { HasAnyRoleDirective } from 'app/shared/auth/has-any-role.directive';
import { I18nRolePipe } from 'app/shared/util/i18n-role.pipe';

@NgModule({
  imports: [ComponentsModule, EventPlannerSharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    I18nRolePipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    HasAnyRoleDirective,
  ],
  entryComponents: [LoginModalComponent],
  exports: [
    EventPlannerSharedLibsModule,
    FindLanguageFromKeyPipe,
    I18nRolePipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    HasAnyRoleDirective,
    ComponentsModule,
  ],
})
export class EventPlannerSharedModule {}
