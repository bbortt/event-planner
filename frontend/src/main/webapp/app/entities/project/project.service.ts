import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

import { Project } from 'app/entities/project/project.model';

import { Account } from 'app/core/auth/account.model';

import { ICreateProject } from 'app/entities/dto/create-project.model';

import * as dayjs from 'dayjs';

type EntityResponseType = HttpResponse<Project>;
type EntityArrayResponseType = HttpResponse<Project[]>;

@Injectable({ providedIn: 'root' })
export class ProjectService {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/projects');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(project: ICreateProject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(project);
    return this.http
      .post<Project>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(project: Project): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(project);
    return this.http
      .put<Project>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Project>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Project[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  archive(id: number): Observable<HttpResponse<{}>> {
    return this.http.put(`${this.resourceUrl}/${id}/archive`, {}, { observe: 'response' });
  }

  getRolePerProject(): Observable<Map<number, string>> {
    return this.http.get<Map<number, string>>(`${this.resourceUrl}/rolePerProject`);
  }

  getAllUsers(project: Project): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.resourceUrl}/${project.id!}/users`);
  }

  protected convertDateFromClient(project: Project | ICreateProject): Project | ICreateProject {
    const copy: Project | ICreateProject = Object.assign({}, project, {
      startTime: project.startTime.isValid() ? project.startTime.toJSON() : undefined,
      endTime: project.endTime.isValid() ? project.endTime.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startTime = dayjs(res.body.startTime);
      res.body.endTime = dayjs(res.body.endTime);
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((project: Project) => {
        project.startTime = dayjs(project.startTime);
        project.endTime = dayjs(project.endTime);
      });
    }
    return res;
  }
}
