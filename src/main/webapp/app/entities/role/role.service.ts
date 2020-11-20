import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { Role } from 'app/shared/model/role.model';

type EntityResponseType = HttpResponse<Role>;
type EntityArrayResponseType = HttpResponse<Role[]>;

@Injectable({ providedIn: 'root' })
export class RoleService {
  public resourceUrl = SERVER_API_URL + 'api/roles';

  constructor(protected http: HttpClient) {}

  find(name: string): Observable<EntityResponseType> {
    return this.http.get<Role>(`${this.resourceUrl}/${name}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Role[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
