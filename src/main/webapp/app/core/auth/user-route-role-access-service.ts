import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from './state-storage.service';

import { AUTHORITY_ADMIN } from 'app/shared/constants/authority.constants';

@Injectable({ providedIn: 'root' })
export class UserRouteRoleAccessService implements CanActivate {
  constructor(private router: Router, private accountService: AccountService, private stateStorageService: StateStorageService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const roles = route.data['roles'];
    const projectId = route.params['id'];
    // We need to call the checkRoles / and so the accountService.identity() function, to ensure,
    // that the client has a principal too, if they already logged in by the server.
    // This could happen on a page refresh.
    return this.checkRoles(projectId, roles, state.url);
  }

  checkRoles(projectId: number, roles: string[], url: string): Observable<boolean> {
    return this.accountService.identity().pipe(
      map(account => {
        if (!roles || roles.length === 0) {
          return true;
        }

        if (account) {
          if (this.accountService.hasAnyAuthority(AUTHORITY_ADMIN)) {
            return true;
          }
          if (this.accountService.hasAnyRole(projectId, roles)) {
            return true;
          }
          if (isDevMode()) {
            console.error('User has not any of required roles: ', roles);
          }
          this.router.navigate(['accessdenied']);
          return false;
        }

        this.stateStorageService.storeUrl(url);
        this.router.navigate(['accessdenied']);
        return false;
      })
    );
  }
}
