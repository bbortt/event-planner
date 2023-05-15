import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';

import { iif, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

import { Project, ProjectService as ApiProjectService } from 'app/api';

import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';

const redirectWithProjectDoesNotExistMessage = (router: Router, alertService: AlertService): Observable<null> => {
  of(router.navigateByUrl('/')).subscribe(() =>
    alertService.addAlert({
      type: 'danger',
      translationKey: 'app.project.invitation.error.invalidToken',
    })
  );

  return of(null);
};

export const projectByToken: ResolveFn<Project | null> = (route: ActivatedRouteSnapshot): Observable<Project | null> => {
  const accountService = inject(AccountService);
  const alertService = inject(AlertService);
  const apiProjectService = inject(ApiProjectService);
  const router = inject(Router);

  const token = route.params['token'];

  if (!token) {
    return redirectWithProjectDoesNotExistMessage(router, alertService);
  }

  return accountService.identity().pipe(
    mergeMap(account =>
      iif(
        () => !!account,
        apiProjectService.findProjectByToken(token, 'response').pipe(
          filter(project => !!project.body),
          map(project => project.body!),
          tap(project => {
            if (project.archived) {
              redirectWithProjectDoesNotExistMessage(router, alertService);
            }
          })
        ),
        of(null)
      )
    ),
    catchError(() => redirectWithProjectDoesNotExistMessage(router, alertService))
  );
};
