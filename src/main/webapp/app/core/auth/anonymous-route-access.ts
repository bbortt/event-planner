import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';

export const canActivate: CanActivateFn = (): Observable<boolean> => {
  const router = inject(Router);
  const accountService = inject(AccountService);

  return accountService.identity().pipe(
    map(account => {
      if (account) {
        router.navigateByUrl('home').catch(() => (window.location.href = '/'));
        return false;
      }

      return true;
    })
  );
};

export const anonymousRouteAccess: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
  canActivate(route, state);
