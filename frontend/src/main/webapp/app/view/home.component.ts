import { Component } from '@angular/core';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/core/login/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent {
  constructor(private accountService: AccountService, private loginService: LoginService) {}

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginService.login();
  }
}
