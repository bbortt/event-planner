import { NgModule } from '@angular/core';
import { EventPlannerSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { LoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { ComponentsModule } from 'app/shared/components/components.module';

@NgModule({
  imports: [ComponentsModule, EventPlannerSharedLibsModule],
  declarations: [FindLanguageFromKeyPipe, AlertComponent, AlertErrorComponent, LoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [LoginModalComponent],
  exports: [
    EventPlannerSharedLibsModule,
    FindLanguageFromKeyPipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    ComponentsModule,
  ],
})
export class EventPlannerSharedModule {}
