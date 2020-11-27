import { NgModule } from '@angular/core';
import { EventPlannerSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { LoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { ComponentsModule } from 'app/shared/components/components.module';
import { HasAnyRoleDirective } from 'app/shared/auth/has-any-role.directive';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [ComponentsModule, EventPlannerSharedLibsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  declarations: [
    FindLanguageFromKeyPipe,
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
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    HasAnyRoleDirective,
    ComponentsModule,
    MatAutocompleteModule,
    MatAutocomplete,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class EventPlannerSharedModule {}
