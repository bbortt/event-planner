import { NgModule } from '@angular/core';
import { EventPlannerSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { LoginComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { ComponentsModule } from 'app/shared/components/components.module';
import { HasAnyRoleDirective } from 'app/shared/auth/has-any-role.directive';
import { I18nRolePipe } from 'app/shared/util/i18n-role.pipe';
import { RegisterComponent } from 'app/account/register/register.component';
import { PasswordStrengthBarComponent } from 'app/account/password/password-strength-bar.component';

@NgModule({
  imports: [ComponentsModule, EventPlannerSharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    I18nRolePipe,
    AlertComponent,
    AlertErrorComponent,
    LoginComponent,
    RegisterComponent,
    PasswordStrengthBarComponent,
    HasAnyAuthorityDirective,
    HasAnyRoleDirective,
  ],
  entryComponents: [LoginComponent],
  exports: [
    EventPlannerSharedLibsModule,
    FindLanguageFromKeyPipe,
    I18nRolePipe,
    AlertComponent,
    AlertErrorComponent,
    LoginComponent,
    RegisterComponent,
    PasswordStrengthBarComponent,
    HasAnyAuthorityDirective,
    HasAnyRoleDirective,
    ComponentsModule,
  ],
})
export class EventPlannerSharedModule {}
