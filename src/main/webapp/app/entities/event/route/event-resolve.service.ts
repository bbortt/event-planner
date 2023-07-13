import { HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';

import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';

@Injectable({ providedIn: 'root' })
export class EventResolveService {
  constructor(
    protected service: EventService,
    protected router: Router,
  ) {}

  byId(id: string | null): Observable<IEvent | null> {
    if (!id) {
      return of(null);
    }

    return this.service.find(Number(id)).pipe(
      mergeMap((event: HttpResponse<IEvent>) => {
        if (event.body) {
          return of(event.body);
        } else {
          this.router.navigateByUrl('404').catch(() => (window.location.href = '/404'));
          return EMPTY;
        }
      }),
    );
  }
}

export const eventById: ResolveFn<IEvent | null> = (route: ActivatedRouteSnapshot) =>
  inject(EventResolveService).byId(route.paramMap.get('eventId'));
