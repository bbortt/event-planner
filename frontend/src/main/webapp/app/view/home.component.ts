import { Component } from '@angular/core';

import { AccountService } from '../core/auth/account.service';
import { LoginService } from 'app/login/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private accountService: AccountService, private loginService: LoginService) {}

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  public login(): void {
    this.loginService.login();
  }
}
