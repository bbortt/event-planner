import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { Project } from 'app/shared/model/project.model';
import { ICreateProject } from 'app/shared/model/dto/create-project.model';

type EntityResponseType = HttpResponse<Project>;
type EntityArrayResponseType = HttpResponse<Project[]>;

@Injectable({ providedIn: 'root' })
export class ProjectService {
  public resourceUrl = SERVER_API_URL + 'services/api/projects';

  constructor(protected http: HttpClient) {}

  create(project: ICreateProject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(project);
    return this.http
      .post<ICreateProject>(this.resourceUrl, copy, { observe: 'response' })
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

  protected convertDateFromClient(project: Project): Project {
    const copy: Project = Object.assign({}, project, {
      startTime: project.startTime && project.startTime.isValid() ? project.startTime.toJSON() : undefined,
      endTime: project.endTime && project.endTime.isValid() ? project.endTime.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startTime = moment(res.body.startTime);
      res.body.endTime = moment(res.body.endTime);
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((project: Project) => {
        project.startTime = moment(project.startTime);
        project.endTime = moment(project.endTime);
      });
    }
    return res;
  }
}
