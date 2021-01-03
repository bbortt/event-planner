import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { InvitationService } from 'app/entities/invitation/invitation.service';

@Component({
  selector: 'app-invitation-via-register',
  templateUrl: './invitation-via-register.component.html',
})
export class InvitationViaRegisterComponent {
  token?: string;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private invitationService: InvitationService) {
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
