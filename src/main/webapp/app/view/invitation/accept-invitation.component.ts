import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { InvitationService } from 'app/entities/invitation/invitation.service';

@Component({
  selector: 'app-accept-invitation',
  templateUrl: './accept-invitation.component.html',
})
export class AcceptInvitationComponent implements OnDestroy {
  token?: string;
  variant: 'login' | 'register';

  private destroy$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private invitationService: InvitationService,
    private router: Router,
    private accountService: AccountService
  ) {
    this.variant = activatedRoute.snapshot.data.variant;
    this.activatedRoute.params
      .pipe(
        tap(params => (this.token = params['token'])),
        switchMap(() => this.invitationService.checkTokenValidity(this.token!)),
        tap(isTokenValid => {
          if (!isTokenValid) {
            this.router.navigate(['/invalid-token']);
            return false;
          }
          return true;
        }),
        // if the token is valid and the user is already assigned in, automatically accept the invitation
        filter(Boolean),
        filter(() => this.accountService.isAuthenticated()),
        switchMap(() => this.invitationService.assignCurrentUserToInvitation(this.token!)),
        switchMap(() => this.accountService.identity(true)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
