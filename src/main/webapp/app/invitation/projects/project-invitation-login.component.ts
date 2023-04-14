import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../login/login.service';
import { StateStorageService } from '../../core/auth/state-storage.service';

@Component({
  selector: 'app-project-invitation-login',
  templateUrl: './project-invitation-login.component.html',
})
export class ProjectInvitationLoginComponent {
  @Input() invitationEmail: String | null = null;

  constructor(private loginService: LoginService, private stateStorageService: StateStorageService, private router: Router) {}

  login(): void {
    this.stateStorageService.storeUrl(this.router.url);
    this.loginService.login();
  }
}
