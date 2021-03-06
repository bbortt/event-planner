import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

import { Location } from 'app/entities/location/location.model';
import { Project } from 'app/entities/project/project.model';

import * as dayjs from 'dayjs';

type EntityResponseType = HttpResponse<Location>;
type EntityArrayResponseType = HttpResponse<Location[]>;

@Injectable({ providedIn: 'root' })
export class LocationService {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/locations');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

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

  nameExistsInProject(project: Project, name: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.resourceUrl}/project/${project.id!}/name-exists`, name);
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

  private convertDates(location: Location): void {
    location.project.startTime = dayjs(location.project.startTime);
    location.project.endTime = dayjs(location.project.endTime);
  }
}
