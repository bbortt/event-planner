import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router, Routes } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAuthorityAccessService } from 'app/core/auth/user-route-authority-access-service';
import { ISection, Section } from 'app/shared/model/section.model';
import { SectionService } from './section.service';
import { SectionComponent } from './section.component';
import { SectionDetailComponent } from './section-detail.component';
import { SectionUpdateComponent } from './section-update.component';

@Injectable({ providedIn: 'root' })
export class SectionResolve implements Resolve<ISection> {
  constructor(private service: SectionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISection> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((section: HttpResponse<Section>) => {
          if (section.body) {
            return of(section.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Section());
  }
}

export const sectionRoute: Routes = [
  {
    path: '',
    component: SectionComponent,
    data: {
      defaultSort: 'id,asc',
      pageTitle: 'eventPlannerApp.section.home.title',
    },
    canActivate: [UserRouteAuthorityAccessService],
  },
  {
    path: ':id/view',
    component: SectionDetailComponent,
    resolve: {
      section: SectionResolve,
    },
    data: {
      pageTitle: 'eventPlannerApp.section.home.title',
    },
    canActivate: [UserRouteAuthorityAccessService],
  },
  {
    path: 'new',
    component: SectionUpdateComponent,
    resolve: {
      section: SectionResolve,
    },
    data: {
      pageTitle: 'eventPlannerApp.section.home.title',
    },
    canActivate: [UserRouteAuthorityAccessService],
  },
  {
    path: ':id/edit',
    component: SectionUpdateComponent,
    resolve: {
      section: SectionResolve,
    },
    data: {
      pageTitle: 'eventPlannerApp.section.home.title',
    },
    canActivate: [UserRouteAuthorityAccessService],
  },
];
