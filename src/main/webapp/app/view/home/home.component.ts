import { Component } from '@angular/core';

import { LoginModalService } from '../../core/login/login-modal.service';
import { AccountService } from '../../core/auth/account.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent {
  constructor(private accountService: AccountService, private loginModalService: LoginModalService) {}

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }
}
