import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';

@Injectable({ providedIn: 'root' })
export class AnonymousRouteAccessService implements CanActivate {
  constructor(private router: Router, private loginService: LoginService, private accountService: AccountService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.identity().pipe(
      map(account => {
        if (account) {
          this.router.navigate(['home']);
          return false;
        }

        return true;
      })
    );
  }
}