import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProject } from '../project.model';
import { ProjectService } from '../service/project.service';

export const projectById: ResolveFn<IProject | null> = (route: ActivatedRouteSnapshot): Observable<IProject | null> => {
  const projectService = inject(ProjectService);
  const router = inject(Router);

  const id = route.params['id'];

  if (id) {
    return projectService.find(id).pipe(
      mergeMap((project: HttpResponse<IProject>) => {
        if (project.body) {
          return of(project.body);
        } else {
          router.navigateByUrl('404').catch(() => (window.location.href = '/404'));
          return EMPTY;
        }
      })
    );
  }
  return of(null);
};
