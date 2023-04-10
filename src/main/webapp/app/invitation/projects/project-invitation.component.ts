import { Component } from '@angular/core';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'app-project-invitation',
  templateUrl: './project-invitation.component.html',
})
export class ProjectInvitationComponent {
  account: Account | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
  }
}
