import { Component } from '@angular/core';

import { AccountService } from '../core/auth/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private accountService: AccountService) {}

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }
}
