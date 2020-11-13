import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Event, IEvent } from 'app/shared/model/event.model';
import { EventService } from './event.service';

@Injectable({ providedIn: 'root' })
export class EventResolve implements Resolve<IEvent> {
  constructor(private service: EventService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEvent> | Observable<never> {
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

    return of(new Event());
  }
}
