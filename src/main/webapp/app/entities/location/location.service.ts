import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from 'app/shared/util/request-util';

import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';
import { Section } from 'app/shared/model/section.model';

import { SERVER_API_URL } from 'app/app.constants';

import * as moment from 'moment';

type EntityResponseType = HttpResponse<Location>;
type EntityArrayResponseType = HttpResponse<Location[]>;

@Injectable({ providedIn: 'root' })
export class LocationService {
  public resourceUrl = SERVER_API_URL + 'api/locations';

  constructor(protected http: HttpClient) {}

  create(location: Location): Observable<EntityResponseType> {
    return this.http
      .post<Location>(this.resourceUrl, location, { observe: 'response' })
      .pipe(map((response: EntityResponseType) => this.convertDateFromServer(response)));
  }

  update(location: Location): Observable<EntityResponseType> {
    return this.http
      .put<Location>(this.resourceUrl, location, { observe: 'response' })
      .pipe(map((response: EntityResponseType) => this.convertDateFromServer(response)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Location>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((response: EntityResponseType) => this.convertDateFromServer(response)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Location[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((response: EntityArrayResponseType) => this.convertDateArrayFromServer(response)));
  }

  findAllByProject(project: Project, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Location[]>(`${this.resourceUrl}/project/${project.id!}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((response: EntityArrayResponseType) => this.convertDateArrayFromServer(response)));
  }

  findAllByProjectInclusiveSections(project: Project): Observable<EntityArrayResponseType> {
    return this.http
      .get<Location[]>(`${this.resourceUrl}/project/${project.id!}/sections`, {
        observe: 'response',
      })
      .pipe(map((response: EntityArrayResponseType) => this.convertDateArrayFromServer(response)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      this.convertDates(res.body);
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach(this.convertDates);
    }
    return res;
  }

  private convertDates(location: Location): Section {
    location.project.startTime = moment(location.project.startTime);
    location.project.endTime = moment(location.project.endTime);
    return location;
  }
}
