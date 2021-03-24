import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

import { Responsibility } from 'app/entities/responsibility/responsibility.model';
import { Project } from 'app/entities/project/project.model';

type EntityResponseType = HttpResponse<Responsibility>;
type EntityArrayResponseType = HttpResponse<Responsibility[]>;

@Injectable({ providedIn: 'root' })
export class ResponsibilityService {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/responsibilities');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(responsibility: Responsibility): Observable<EntityResponseType> {
    return this.http.post<Responsibility>(this.resourceUrl, responsibility, { observe: 'response' });
  }

  update(responsibility: Responsibility): Observable<EntityResponseType> {
    return this.http.put<Responsibility>(this.resourceUrl, responsibility, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Responsibility>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Responsibility[]>(this.resourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  findAllByProject(project: Project, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Responsibility[]>(`${this.resourceUrl}/project/${project.id!}`, {
      params: options,
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  nameExistsInProject(project: Project, name: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.resourceUrl}/project/${project.id!}/name-exists`, name);
  }
}
