import { Component } from '@angular/core';

import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-project-invitation-login',
  templateUrl: './project-invitation-login.component.html',
})
export class ProjectInvitationLoginComponent {
  constructor(private loginService: LoginService) {}

  login(): void {
    this.loginService.login();
  }
}
