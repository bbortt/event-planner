import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';
import { InvitationService } from 'app/entities/invitation/invitation.service';
import { LoginService } from 'app/login/login.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';

@Component({
  selector: 'app-accept-invitation',
  templateUrl: './accept-invitation.component.html',
})
export class AcceptInvitationComponent implements OnDestroy {
  token?: string;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private alertService: AlertService,
    private invitationService: InvitationService,
    private loginService: LoginService,
    private stateStorageService: StateStorageService
  ) {
    this.activatedRoute.params
      .pipe(
        tap(params => (this.token = params['token'] as string)),
        switchMap(() => this.invitationService.checkTokenValidity(this.token!)),
        tap(isTokenValid => {
          if (!isTokenValid) {
            this.router.navigate(['/invalid-token']);
          }
        }),
        // if the token is valid and the user is already assigned in, automatically accept the invitation
        filter(Boolean),
        filter(() => this.accountService.isAuthenticated()),
        switchMap(() => this.invitationService.assignCurrentUserToInvitation(this.token!)),
        catchError(err => {
          this.alertService.addAlert({
            type: 'danger',
            translationKey: 'eventPlannerApp.invitation.accepting.failed',
          });
          throw err;
        }),
        switchMap(() => this.accountService.identity(true)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.router.navigate(['/']).then(() =>
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'eventPlannerApp.invitation.accepting.success',
          })
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    this.stateStorageService.storeUrl(this.router.routerState.snapshot.url);
    this.loginService.login();
  }
}
