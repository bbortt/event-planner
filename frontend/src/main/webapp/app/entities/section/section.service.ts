import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

import { Event } from 'app/entities/event/event.model';
import { Location } from 'app/entities/location/location.model';
import { Section } from 'app/entities/section/section.model';

import * as dayjs from 'dayjs';

type EntityResponseType = HttpResponse<Section>;
type EntityArrayResponseType = HttpResponse<Section[]>;

@Injectable({ providedIn: 'root' })
export class SectionService {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/sections');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

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

  nameExistsInLocation(location: Location, name: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.resourceUrl}/location/${location.id!}/name-exists`, name);
  }

  private convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      this.convertDates(res.body);
    }
    return res;
  }

  private convertDates(section: Section): Section {
    const project = section.location.project;
    project.startTime = dayjs(project.startTime);
    project.endTime = dayjs(project.endTime);

    section.events?.forEach((event: Event) => {
      event.startTime = dayjs(event.startTime);
      event.endTime = dayjs(event.endTime);
    });

    return section;
  }
}
