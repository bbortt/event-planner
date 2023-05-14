import { inject, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';

import { StateStorageService } from './state-storage.service';

export const canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const accountService = inject(AccountService);
  const stateStorageService = inject(StateStorageService);

  return accountService.identity().pipe(
    map(account => {
      if (account) {
        const authorities = route.data['authorities'];

        if (!authorities || authorities.length === 0 || accountService.hasAnyAuthority(authorities)) {
          return true;
        }

        if (isDevMode()) {
          console.error('User has not any of required authorities: ', authorities);
        }

        router.navigateByUrl('accessdenied').catch(() => (window.location.href = '/'));

        return false;
      }

      stateStorageService.storeUrl(state.url);
      loginService.login();

      return false;
    })
  );
};

export const userRouteAccess: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => canActivate(route, state);
