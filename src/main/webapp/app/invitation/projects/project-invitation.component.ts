import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'app-project-invitation',
  templateUrl: './project-invitation.component.html',
})
export class ProjectInvitationComponent implements OnInit, OnDestroy {
  invitationEmail: string | null = null;
  account: Account | null = null;

  private accountSubscription: Subscription | null = null;

  constructor(private activatedRoute: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe(account => {
      this.account = account;
    });
  }

  ngOnDestroy(): void {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }

  acceptInvitation() {}
}
