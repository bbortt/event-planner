import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { Location } from 'app/shared/model/location.model';

type EntityResponseType = HttpResponse<Location>;
type EntityArrayResponseType = HttpResponse<Location[]>;

@Injectable({ providedIn: 'root' })
export class LocationService {
  public resourceUrl = SERVER_API_URL + 'api/locations';

  constructor(protected http: HttpClient) {}

  create(location: Location): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(location);
    return this.http
      .post<Location>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(location: Location): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(location);
    return this.http
      .put<Location>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Location>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Location[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(location: Location): Location {
    const copy: Location = Object.assign({}, location, {
      dateFrom: location.dateFrom && location.dateFrom.isValid() ? location.dateFrom.toJSON() : undefined,
      dateTo: location.dateTo && location.dateTo.isValid() ? location.dateTo.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateFrom = res.body.dateFrom ? moment(res.body.dateFrom) : undefined;
      res.body.dateTo = res.body.dateTo ? moment(res.body.dateTo) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((location: Location) => {
        location.dateFrom = location.dateFrom ? moment(location.dateFrom) : undefined;
        location.dateTo = location.dateTo ? moment(location.dateTo) : undefined;
      });
    }
    return res;
  }
}
