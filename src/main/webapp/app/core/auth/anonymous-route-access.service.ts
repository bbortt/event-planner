import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';

@Injectable({ providedIn: 'root' })
export class AnonymousRouteAccessService {
  constructor(private router: Router, private accountService: AccountService) {}

  canActivate(): Observable<boolean> {
    return this.accountService.identity().pipe(
      map(account => {
        if (account) {
          this.router.navigateByUrl('home').catch(() => (window.location.href = '/'));
          return false;
        }

        return true;
      })
    );
  }
}

export const anonymousRouteAccess: CanActivateFn = () => inject(AnonymousRouteAccessService).canActivate();
