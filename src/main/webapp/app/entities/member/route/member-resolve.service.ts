import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMember } from '../member.model';
import { MemberService } from '../service/member.service';

export const memberById: ResolveFn<IMember | null> = (route: ActivatedRouteSnapshot): Observable<IMember | null> => {
  const id = route.paramMap.get('memberId');

  if (!id) {
    return of(null);
  }

  const router: Router = inject(Router);
  return inject(MemberService)
    .find(Number(id))
    .pipe(
      mergeMap((member: HttpResponse<IMember>) => {
        if (member.body) {
          return of(member.body);
        } else {
          router.navigateByUrl('404').catch(() => (window.location.href = '/404'));
          return EMPTY;
        }
      })
    );
};

export default memberById;
