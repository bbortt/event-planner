import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';

export const eventById: ResolveFn<IEvent | null> = (route: ActivatedRouteSnapshot): Observable<IEvent | null> => {
  const id = route.paramMap.get('eventId');

  if (!id) {
    return of(null);
  }

  const router: Router = inject(Router);
  return inject(EventService)
    .find(Number(id))
    .pipe(
      mergeMap((event: HttpResponse<IEvent>) => {
        if (event.body) {
          return of(event.body);
        } else {
          router.navigateByUrl('404').catch(() => (window.location.href = '/404'));
          return EMPTY;
        }
      }),
    );
};

export default eventById;
