import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IResponsibility } from 'app/shared/model/responsibility.model';
import { IProject } from 'app/shared/model/project.model';

type EntityResponseType = HttpResponse<IResponsibility>;
type EntityArrayResponseType = HttpResponse<IResponsibility[]>;

@Injectable({ providedIn: 'root' })
export class ResponsibilityService {
  public resourceUrl = SERVER_API_URL + 'api/responsibilities';

  constructor(protected http: HttpClient) {}

  create(responsibility: IResponsibility): Observable<EntityResponseType> {
    return this.http.post<IResponsibility>(this.resourceUrl, responsibility, { observe: 'response' });
  }

  update(responsibility: IResponsibility): Observable<EntityResponseType> {
    return this.http.put<IResponsibility>(this.resourceUrl, responsibility, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResponsibility>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResponsibility[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  findAllByProject(project: IProject, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResponsibility[]>(`${this.resourceUrl}/${project.id!}/responsibilities`, {
      params: options,
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
