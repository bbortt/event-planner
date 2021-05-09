import { Component, OnInit } from '@angular/core';

import { AccountService } from '../core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;

  constructor(private accountService: AccountService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe((account: Account | null) => (this.isAuthenticated = !!account));
  }

  public login(): void {
    this.loginService.login();
  }
}
