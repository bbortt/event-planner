import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { IRole, Role } from 'app/shared/model/role.model';
import { RoleService } from './role.service';

@Injectable({ providedIn: 'root' })
export class RoleResolve implements Resolve<IRole> {
  constructor(private service: RoleService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRole> | Observable<never> {
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

    return of(new Role());
  }
}
