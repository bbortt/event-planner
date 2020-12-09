import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { Section } from 'app/shared/model/section.model';
import { Location } from 'app/shared/model/location.model';

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
    return this.http.get<Section>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAllByLocation(location: Location, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Section[]>(`${this.resourceUrl}/location/${location.id!}`, {
      params: options,
      observe: 'response',
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Section[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
