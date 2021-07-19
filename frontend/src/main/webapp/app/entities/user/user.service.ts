import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IUser, User } from './user.model';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Pagination } from 'app/core/request/request.model';

import { createRequestOption } from 'app/core/request/request-util';

type EntityResponseType = HttpResponse<User>;

@Injectable({ providedIn: 'root' })
export class UserService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/users');

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<User>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  findByEmailOrLogin(emailOrLogin: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.resourceUrl}/findByEmailOrLogin/${emailOrLogin}`);
  }
}
