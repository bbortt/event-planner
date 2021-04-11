import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { RoleService } from './role.service';

import { Role } from 'app/entities/role/role.model';

@Injectable({ providedIn: 'root' })
export class RoleResolve implements Resolve<Role> {
  constructor(private service: RoleService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Role> | Observable<never> {
    let roleId = route.params['roleId'];

    // Search recursively for Route.children
    let parent = route.parent;
    while (!roleId && parent) {
      roleId = parent.params['roleId'];
      parent = parent.parent;
    }

    if (roleId) {
      return this.service.find(roleId).pipe(
        flatMap((role: HttpResponse<Role>) => {
          if (role.body) {
            return of(role.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }

    return of({} as Role);
  }
}
