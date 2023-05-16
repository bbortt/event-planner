import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { Observable, of } from 'rxjs';

import { IProject } from 'app/entities/project/project.model';

export const projectFromParentRoute: ResolveFn<IProject | null> = (route: ActivatedRouteSnapshot): Observable<IProject | null> => {
  if (!route.parent) {
    return of(null);
  }

  return of(route.parent.data.project as IProject);
};
