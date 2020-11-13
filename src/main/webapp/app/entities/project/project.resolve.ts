import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { IProject, Project } from 'app/shared/model/project.model';
import { ProjectService } from './project.service';

@Injectable({ providedIn: 'root' })
export class ProjectResolve implements Resolve<IProject> {
  constructor(private service: ProjectService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProject> | Observable<never> {
    let projectId = route.params['projectId'];

    // Search recursively for Route.children
    let parent = route.parent;
    while (!projectId && parent) {
      projectId = parent.params['projectId'];
      parent = parent.parent;
    }

    if (projectId) {
      return this.service.find(projectId).pipe(
        flatMap((project: HttpResponse<Project>) => {
          if (project.body) {
            return of(project.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }

    return of(new Project());
  }
}
