import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IUser, User } from './user.model';
import { Project } from 'app/entities/project/project.model';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Pagination } from 'app/core/request/request.model';

import { createRequestOption } from 'app/core/request/request-util';

type EntityArrayResponseType = HttpResponse<User[]>;

@Injectable({ providedIn: 'root' })
export class UserService {
  resourceUrl = this.applicationConfigService.getEndpointFor('services/users');

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  query(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  findByEmailOrLogin(emailOrLogin: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.resourceUrl}/findByEmailOrLogin/${emailOrLogin}`);
  }

  findAllByProject(project: Project, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<User[]>(`${this.resourceUrl}/project/${project.id!}`, {
      params: options,
      observe: 'response',
    });
  }
}
