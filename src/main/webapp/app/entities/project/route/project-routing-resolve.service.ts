import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProject } from '../project.model';
import { ProjectService } from '../service/project.service';

@Injectable({ providedIn: 'root' })
export class ProjectRoutingResolveService implements Resolve<IProject | null> {
  constructor(protected service: ProjectService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProject | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((project: HttpResponse<IProject>) => {
          if (project.body) {
            return of(project.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
