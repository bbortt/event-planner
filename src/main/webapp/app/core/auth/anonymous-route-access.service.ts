import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';

@Injectable({ providedIn: 'root' })
export class AnonymousRouteAccessService implements CanActivate {
  constructor(private router: Router, private accountService: AccountService) {}

  canActivate(): Observable<boolean> {
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
