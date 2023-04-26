import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { LoginService } from 'app/login/login.service';

@Component({
  selector: 'app-project-invitation-login',
  templateUrl: './project-invitation-login.component.html',
})
export class ProjectInvitationLoginComponent {
  @Input() invitationEmail: string | null = null;

  constructor(private loginService: LoginService, private stateStorageService: StateStorageService, private router: Router) {}

  login(): void {
    this.stateStorageService.storeUrl(this.router.url);
    this.loginService.login();
  }
}
