import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { iif, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { Project, ProjectService as ApiProjectService } from 'app/api';

import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';

@Injectable({ providedIn: 'root' })
export class ProjectTokenRoutingResolveService implements Resolve<Project | null> {
  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private apiProjectService: ApiProjectService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Project | null | never> {
    const token = route.params['token'];

    if (!token) {
      return this.redirectWithProjectDoesNotExistMessage();
    }

    return this.accountService.identity().pipe(
      mergeMap(account =>
        iif(
          () => !!account,
          this.apiProjectService.findProjectByToken(token, 'response').pipe(
            filter(project => !!project.body),
            map(project => project.body!)
          ),
          of(null)
        )
      ),
      catchError(() => this.redirectWithProjectDoesNotExistMessage())
    );
  }

  private redirectWithProjectDoesNotExistMessage(): Observable<null> {
    of(this.router.navigate(['/'])).subscribe(() => {
      this.alertService.addAlert({
        type: 'danger',
        translationKey: 'app.project.invitation.error.invalidToken',
      });
    });

    return of(null);
  }
}
