import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import EventDetailComponent from './detail/event-detail.component';
import EventComponent from './list/event.component';
import EventUpdateComponent from './update/event-update.component';

import { eventById } from './route/event-resolve.service';

const eventRoutes: Routes = [
  {
    path: '',
    component: EventComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':eventId/view',
    component: EventDetailComponent,
    resolve: {
      event: eventById,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventUpdateComponent,
    resolve: {
      event: eventById,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':eventId/edit',
    component: EventUpdateComponent,
    resolve: {
      event: eventById,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default eventRoutes;
