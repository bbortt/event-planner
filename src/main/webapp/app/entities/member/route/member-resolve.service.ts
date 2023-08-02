import { HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';

import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMember } from '../member.model';
import { MemberService } from '../service/member.service';

@Injectable({ providedIn: 'root' })
export class MemberResolveService {
  constructor(private memberService: MemberService, private router: Router) {}

  byId(id: string | null): Observable<IMember | null> {
    if (!id) {
      return of(null);
    }

    return this.memberService.find(Number(id)).pipe(
      mergeMap((member: HttpResponse<IMember>) => {
        if (member.body) {
          return of(member.body);
        } else {
          this.router.navigateByUrl('404').catch(() => (window.location.href = '/404'));
          return EMPTY;
        }
      })
    );
  }
}

export const memberById: ResolveFn<IMember | null> = (route: ActivatedRouteSnapshot) =>
  inject(MemberResolveService).byId(route.paramMap.get('memberId'));
