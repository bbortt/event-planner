import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { Observable, of } from 'rxjs';

import { IProject } from '../../../../entities/project/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectFromParentResolveService implements Resolve<IProject | null> {
  constructor(protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProject | null | never> {
    if (!route.parent) {
      return of(null);
    }

    return of(route.parent.data.project);
  }
}
