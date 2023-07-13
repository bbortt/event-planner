import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { userRouteAccess } from 'app/core/auth/user-route-access.service';

import { eventById } from './event-resolve.service';

import { EventComponent } from '../list/event.component';
import { EventDetailComponent } from '../detail/event-detail.component';
import { EventUpdateComponent } from '../update/event-update.component';

const eventRoute: Routes = [
  {
    path: '',
    component: EventComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [userRouteAccess],
  },
  {
    path: ':eventId/view',
    component: EventDetailComponent,
    resolve: {
      event: eventById,
    },
    canActivate: [userRouteAccess],
  },
  {
    path: 'new',
    component: EventUpdateComponent,
    resolve: {
      event: eventById,
    },
    canActivate: [userRouteAccess],
  },
  {
    path: ':eventId/edit',
    component: EventUpdateComponent,
    resolve: {
      event: eventById,
    },
    canActivate: [userRouteAccess],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventRoute)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
