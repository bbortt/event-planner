import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router, Routes } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAuthorityAccessService } from 'app/core/auth/user-route-authority-access-service';
import { IProject, Project } from 'app/shared/model/project.model';
import { ProjectService } from './project.service';
import { ProjectComponent } from './project.component';
import { ProjectDetailComponent } from './project-detail.component';
import { ProjectUpdateComponent } from './project-update.component';
import { ProjectCreateComponent } from './project-create.component';

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

export const projectRoute: Routes = [
  {
    path: '',
    component: ProjectComponent,
    data: {
      defaultSort: 'id,asc',
      pageTitle: 'eventPlannerApp.project.home.title',
    },
    canActivate: [UserRouteAuthorityAccessService],
  },
  {
    path: ':id/view',
    component: ProjectDetailComponent,
    resolve: {
      project: ProjectResolve,
    },
    data: {
      pageTitle: 'eventPlannerApp.project.home.title',
    },
    canActivate: [UserRouteAuthorityAccessService],
  },
  {
    path: 'new',
    component: ProjectCreateComponent,
    resolve: {
      project: ProjectResolve,
    },
    data: {
      pageTitle: 'eventPlannerApp.project.home.title',
    },
    canActivate: [UserRouteAuthorityAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectUpdateComponent,
    resolve: {
      project: ProjectResolve,
    },
    data: {
      pageTitle: 'eventPlannerApp.project.home.title',
    },
    canActivate: [UserRouteAuthorityAccessService],
  },
];
