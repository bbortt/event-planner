import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from './state-storage.service';
import { LoginService } from 'app/login/login.service';

@Injectable({ providedIn: 'root' })
export class UserRouteRoleAccessService implements CanActivate {
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
          const roles = route.data['roles'];
          const projectId = route.params['projectId'];

          if (!roles || roles.length === 0 || this.accountService.hasAnyRole(projectId, roles)) {
            return true;
          }

          if (isDevMode()) {
            console.error('User has not any of required roles: ', roles);
          }

          this.router.navigate(['accessdenied']);

          return false;
        }

        this.stateStorageService.storeUrl(state.url);
        this.loginService.login();

        return false;
      })
    );
  }
}
