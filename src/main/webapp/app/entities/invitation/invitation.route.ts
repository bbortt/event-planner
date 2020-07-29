import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IInvitation, Invitation } from 'app/shared/model/invitation.model';
import { InvitationService } from './invitation.service';
import { InvitationComponent } from './invitation.component';
import { InvitationDetailComponent } from './invitation-detail.component';
import { InvitationUpdateComponent } from './invitation-update.component';

@Injectable({ providedIn: 'root' })
export class InvitationResolve implements Resolve<IInvitation> {
  constructor(private service: InvitationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInvitation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
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

export const invitationRoute: Routes = [
  {
    path: '',
    component: InvitationComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'eventPlannerApp.invitation.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InvitationDetailComponent,
    resolve: {
      invitation: InvitationResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'eventPlannerApp.invitation.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InvitationUpdateComponent,
    resolve: {
      invitation: InvitationResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'eventPlannerApp.invitation.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InvitationUpdateComponent,
    resolve: {
      invitation: InvitationResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'eventPlannerApp.invitation.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
