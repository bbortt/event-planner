import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMember } from '../member.model';
import { MemberService } from '../service/member.service';

export const memberById: ResolveFn<IMember | null> = (route: ActivatedRouteSnapshot): Observable<IMember | null> => {
  const memberService = inject(MemberService);
  const router = inject(Router);

  const id = route.params['id'];

  if (id) {
    return memberService.find(id).pipe(
      mergeMap((member: HttpResponse<IMember>) => {
        if (member.body) {
          return of(member.body);
        } else {
          router.navigateByUrl('404').catch(() => (window.location.href = '/404'));
          return EMPTY;
        }
      })
    );
  }

  return of(null);
};
