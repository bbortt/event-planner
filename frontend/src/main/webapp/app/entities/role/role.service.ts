import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { createRequestOption } from 'app/core/request/request-util';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

import { Role } from 'app/entities/role/role.model';

type EntityResponseType = HttpResponse<Role>;
type EntityArrayResponseType = HttpResponse<Role[]>;

@Injectable({ providedIn: 'root' })
export class RoleService {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/roles');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  find(name: string): Observable<EntityResponseType> {
    return this.http.get<Role>(`${this.resourceUrl}/${name}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Role[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
