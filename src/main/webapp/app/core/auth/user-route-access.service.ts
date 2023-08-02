import { inject, Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';

import { StateStorageService } from './state-storage.service';

@Injectable({ providedIn: 'root' })
export class UserRouteAccessService {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private accountService: AccountService,
    private stateStorageService: StateStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.identity().pipe(
      map(account => {
        if (account) {
          const authorities = route.data['authorities'];

          if (!authorities || authorities.length === 0 || this.accountService.hasAnyAuthority(authorities)) {
            return true;
          }

          if (isDevMode()) {
            console.error('User has not any of required authorities: ', authorities);
          }

          this.router.navigateByUrl('accessdenied').catch(() => (window.location.href = '/'));

          return false;
        }

        this.stateStorageService.storeUrl(state.url);
        this.loginService.login();

        return false;
      })
    );
  }
}

export const userRouteAccess: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
  inject(UserRouteAccessService).canActivate(route, state);
