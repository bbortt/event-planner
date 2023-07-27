import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';

import { INVITATION_ROUTES } from './invitation.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(INVITATION_ROUTES)],
  declarations: [],
})
export class InvitationModule {}
