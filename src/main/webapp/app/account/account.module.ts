import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from 'app/shared/shared.module';
import { ActivateComponent } from './activate/activate.component';
import { PasswordComponent } from './password/password.component';
import { PasswordResetInitComponent } from './password-reset/init/password-reset-init.component';
import { PasswordResetFinishComponent } from './password-reset/finish/password-reset-finish.component';
import { SettingsComponent } from './settings/settings.component';
import { accountState } from './account.route';

@NgModule({
  imports: [EventPlannerSharedModule, RouterModule.forChild(accountState)],
  declarations: [ActivateComponent, PasswordComponent, PasswordResetInitComponent, PasswordResetFinishComponent, SettingsComponent],
})
export class AccountModule {}
