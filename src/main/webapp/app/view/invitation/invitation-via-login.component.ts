import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationService } from 'app/entities/invitation/invitation.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-invitation-via-login',
  templateUrl: './invitation-via-login.component.html',
})
export class InvitationViaLoginComponent {
  token?: string;

  constructor(private activatedRoute: ActivatedRoute, private invitationService: InvitationService, private router: Router) {
    this.activatedRoute.params
      .pipe(
        tap(params => (this.token = params['token'])),
        switchMap(() => this.invitationService.checkTokenValidity(this.token!))
      )
      .subscribe(isTokenValid => {
        if (!isTokenValid) {
          this.router.navigate(['/invalid-token']);
        }
      });
  }
}
