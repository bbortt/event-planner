import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from 'app/shared/util/request-util';

import { Event } from 'app/shared/model/event.model';
import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';
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

  nameExistsInProject(project: Project, name: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.resourceUrl}/project/${project.id!}/name-exists`, name);
  }

  private convertDateFromServer(res: EntityResponseType): EntityResponseType {
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

  private convertDates(section: Section): Section {
    if (section.location?.project) {
      section.location.project.startTime = moment(section.location.project.startTime);
      section.location.project.endTime = moment(section.location.project.endTime);
    }

    section.events?.forEach((event: Event) => {
      event.startTime = moment(event.startTime);
      event.endTime = moment(event.endTime);
    });

    return section;
  }
}
