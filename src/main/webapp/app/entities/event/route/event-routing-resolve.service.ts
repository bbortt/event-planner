import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';

@Injectable({ providedIn: 'root' })
export class EventRoutingResolveService implements Resolve<IEvent | null> {
  constructor(protected service: EventService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEvent | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((event: HttpResponse<IEvent>) => {
          if (event.body) {
            return of(event.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
