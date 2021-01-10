import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from 'app/shared/util/request-util';

import { Event } from 'app/shared/model/event.model';
import { Location } from 'app/shared/model/location.model';
import { Section } from 'app/shared/model/section.model';

import { SERVER_API_URL } from 'app/app.constants';

import * as moment from 'moment';

type EntityResponseType = HttpResponse<Section>;
type EntityArrayResponseType = HttpResponse<Section[]>;

@Injectable({ providedIn: 'root' })
export class SectionService {
  public resourceUrl = SERVER_API_URL + 'api/sections';

  constructor(protected http: HttpClient) {}

  create(section: Section): Observable<EntityResponseType> {
    return this.http.post<Section>(this.resourceUrl, section, { observe: 'response' });
  }

  update(section: Section): Observable<EntityResponseType> {
    return this.http.put<Section>(this.resourceUrl, section, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Section>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((response: EntityResponseType) => this.convertDateFromServer(response)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Section[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAllByLocationInclusiveEvents(location: Location): Observable<EntityArrayResponseType> {
    return this.http
      .get<Location[]>(`${this.resourceUrl}/project/${location.project.id!}/location/${location.id!}/events`, {
        observe: 'response',
      })
      .pipe(map((response: EntityArrayResponseType) => this.convertDateArrayFromServer(response)));
  }

  private convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      this.convertDateInSectionEvents(res.body);
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach(this.convertDateInSectionEvents);
    }
    return res;
  }

  private convertDateInSectionEvents(section: Section): Section {
    section.events?.forEach((event: Event) => {
      event.startTime = event.startTime ? moment(event.startTime) : undefined;
      event.endTime = event.endTime ? moment(event.endTime) : undefined;
    });

    const project = section.location?.project;
    if (project) {
      project.startTime = moment(project.startTime);
      project.endTime = moment(project.endTime);
    }

    return section;
  }
}
