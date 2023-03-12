import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MemberComponent } from '../list/member.component';
import { MemberDetailComponent } from '../detail/member-detail.component';
import { MemberUpdateComponent } from '../update/member-update.component';
import { MemberRoutingResolveService } from './member-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const memberRoute: Routes = [
  {
    path: '',
    component: MemberComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MemberDetailComponent,
    resolve: {
      member: MemberRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MemberUpdateComponent,
    resolve: {
      member: MemberRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MemberUpdateComponent,
    resolve: {
      member: MemberRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(memberRoute)],
  exports: [RouterModule],
})
export class MemberRoutingModule {}
