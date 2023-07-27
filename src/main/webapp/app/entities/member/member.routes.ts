import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import MemberDetailComponent from './detail/member-detail.component';
import MemberComponent from './list/member.component';
import MemberUpdateComponent from './update/member-update.component';

import { memberById } from './route/member-resolve.service';

const memberRoutes: Routes = [
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
      member: memberById,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MemberUpdateComponent,
    resolve: {
      member: memberById,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MemberUpdateComponent,
    resolve: {
      member: memberById,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default memberRoutes;
