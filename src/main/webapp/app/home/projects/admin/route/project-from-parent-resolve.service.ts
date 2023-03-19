import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';

import { IProject } from '../../../../entities/project/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectFromParentResolveService implements Resolve<IProject | null> {
  resolve(route: ActivatedRouteSnapshot): Observable<IProject | null> {
    if (!route.parent) {
      return of(null);
    }

    return of(route.parent.data.project as IProject);
  }
}
