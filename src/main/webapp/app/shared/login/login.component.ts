import { AfterViewInit, Component, ElementRef, Input, Optional, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { InvitationService } from 'app/entities/invitation/invitation.service';
import { LoginService } from 'app/core/login/login.service';

@Component({
  selector: 'jhi-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('username', { static: false })
  username?: ElementRef;

  authenticationError = false;

  loginForm = this.fb.group({
    username: [''],
    password: [''],
    rememberMe: [false],
  });

  @Input()
  invitationToken?: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private invitationService: InvitationService,
    private loginService: LoginService,
    @Optional() public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit(): void {
    if (this.username) {
      this.username.nativeElement.focus();
    }
  }

  cancel(): void {
    this.authenticationError = false;
    this.loginForm.patchValue({
      username: '',
      password: '',
    });
    if (this.activeModal) {
      this.activeModal.dismiss('cancel');
    }
  }

  login(): void {
    this.loginService
      .login({
        username: this.loginForm.get('username')!.value,
        password: this.loginForm.get('password')!.value,
      })
      .pipe(
        switchMap(() => (this.invitationToken ? this.invitationService.assignCurrentUserToInvitation(this.invitationToken) : of(null))),
        switchMap(() => (this.invitationToken ? this.accountService.identity(true) : of(null)))
      )
      .subscribe(
        () => {
          this.authenticationError = false;
          if (this.activeModal) {
            this.activeModal.close();
          }
          if (
            this.router.url === '/account/register' ||
            this.router.url.startsWith('/account/activate') ||
            this.router.url.startsWith('/account/reset/') ||
            this.router.url.startsWith('/invitation/')
          ) {
            this.router.navigate(['']);
          }
        },
        () => (this.authenticationError = true)
      );
  }

  register(): void {
    if (this.activeModal) {
      this.activeModal.dismiss('to state register');
    }
    if (this.invitationToken) {
      this.router.navigate([`/invitation/register/${this.invitationToken}`]);
    } else {
      this.router.navigate(['/account/register']);
    }
  }

  requestResetPassword(): void {
    if (this.activeModal) {
      this.activeModal.dismiss('to state requestReset');
    }
    this.router.navigate(['/account/reset', 'request']);
  }
}
