import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { userRouteAccess } from 'app/core/auth/user-route-access';

import { memberById } from './member-routing-resolve';

import { MemberComponent } from '../list/member.component';
import { MemberDetailComponent } from '../detail/member-detail.component';
import { MemberUpdateComponent } from '../update/member-update.component';

const memberRoute: Routes = [
  {
    path: '',
    component: MemberComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [userRouteAccess],
  },
  {
    path: ':id/view',
    component: MemberDetailComponent,
    resolve: {
      member: inject(memberById),
    },
    canActivate: [userRouteAccess],
  },
  {
    path: 'new',
    component: MemberUpdateComponent,
    resolve: {
      member: inject(memberById),
    },
    canActivate: [userRouteAccess],
  },
  {
    path: ':id/edit',
    component: MemberUpdateComponent,
    resolve: {
      member: inject(memberById),
    },
    canActivate: [userRouteAccess],
  },
];

@NgModule({
  imports: [RouterModule.forChild(memberRoute)],
  exports: [RouterModule],
})
export class MemberRoutingModule {}
