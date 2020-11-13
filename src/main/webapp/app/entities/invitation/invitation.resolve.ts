import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { IInvitation, Invitation } from 'app/shared/model/invitation.model';
import { InvitationService } from './invitation.service';

@Injectable({ providedIn: 'root' })
export class InvitationResolve implements Resolve<IInvitation> {
  constructor(private service: InvitationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInvitation> | Observable<never> {
    let invitationId = route.params['invitationId'];

    // Search recursively for Route.children
    let parent = route.parent;
    while (!invitationId && parent) {
      invitationId = parent.params['invitationId'];
      parent = parent.parent;
    }

    if (invitationId) {
      return this.service.find(invitationId).pipe(
        flatMap((invitation: HttpResponse<Invitation>) => {
          if (invitation.body) {
            return of(invitation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }

    return of(new Invitation());
  }
}
