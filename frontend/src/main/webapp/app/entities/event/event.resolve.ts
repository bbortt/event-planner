import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { EventService } from './event.service';

import { Event } from 'app/entities/event/event.model';

@Injectable({ providedIn: 'root' })
export class EventResolve implements Resolve<Event> {
  constructor(private service: EventService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Event> | Observable<never> {
    let eventId = route.params['eventId'];

    // Search recursively for Route.children
    let parent = route.parent;
    while (!eventId && parent) {
      eventId = parent.params['eventId'];
      parent = parent.parent;
    }

    if (eventId) {
      return this.service.find(eventId).pipe(
        flatMap((event: HttpResponse<Event>) => {
          if (event.body) {
            return of(event.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }

    return of({} as Event);
  }
}
