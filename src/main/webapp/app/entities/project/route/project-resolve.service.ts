import { inject, Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';

import { Observable, of, EMPTY, iif, from } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

import { Project, ProjectService as ApiProjectService } from 'app/api';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';

import { IProject } from '../project.model';
import { ProjectService } from '../service/project.service';

@Injectable({ providedIn: 'root' })
export class ProjectResolveService {
  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private apiProjectService: ApiProjectService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  byId(id: string | null): Observable<IProject | null> {
    if (!id) {
      return of(null);
    }

    return this.projectService.find(Number(id)).pipe(
      mergeMap((project: HttpResponse<IProject>) => {
        if (project.body) {
          return of(project.body);
        } else {
          this.router.navigateByUrl('404').catch(() => (window.location.href = '/404'));
          return EMPTY;
        }
      })
    );
  }

  byToken(token: string | null): Observable<Project | null> {
    if (!token) {
      return of(null);
    }

    return this.accountService.identity().pipe(
      mergeMap(account =>
        iif(
          () => !!account,
          this.apiProjectService.findProjectByToken(token, 'response').pipe(
            filter(project => !!project.body),
            map(project => project.body!),
            tap(project => {
              if (project.archived) {
                this.redirectWithProjectDoesNotExistMessage();
              }
            })
          ),
          of(null)
        )
      ),
      catchError(() => this.redirectWithProjectDoesNotExistMessage())
    );
  }

  private redirectWithProjectDoesNotExistMessage(): Observable<null> {
    from(this.router.navigateByUrl('/')).subscribe(() =>
      this.alertService.addAlert({
        type: 'danger',
        translationKey: 'app.project.invitation.error.invalidToken',
      })
    );

    return of(null);
  }
}

export const projectById: ResolveFn<IProject | null> = (route: ActivatedRouteSnapshot) =>
  inject(ProjectResolveService).byId(route.paramMap.get('projectId'));
export const projectByToken: ResolveFn<Project | null> = (route: ActivatedRouteSnapshot) =>
  inject(ProjectResolveService).byToken(route.paramMap.get('token'));
