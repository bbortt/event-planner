import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Section } from 'app/shared/model/section.model';
import { SectionService } from './section.service';

@Injectable({ providedIn: 'root' })
export class SectionResolve implements Resolve<Section> {
  constructor(private service: SectionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Section> | Observable<never> {
    let sectionId = route.params['sectionId'];

    // Search recursively for Route.children
    let parent = route.parent;
    while (!sectionId && parent) {
      sectionId = parent.params['sectionId'];
      parent = parent.parent;
    }

    if (sectionId) {
      return this.service.find(sectionId).pipe(
        mergeMap((section: HttpResponse<Section>) => {
          if (section.body) {
            return of(section.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }

    return of({} as Section);
  }
}
