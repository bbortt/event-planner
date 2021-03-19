import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { LocationTimeSlot } from 'app/shared/model/location-time-slot.model';

type EntityResponseType = HttpResponse<LocationTimeSlot>;
type EntityArrayResponseType = HttpResponse<LocationTimeSlot[]>;

@Injectable({ providedIn: 'root' })
export class LocationTimeSlotService {
  public resourceUrl = SERVER_API_URL + 'services/api/location-time-slots';

  constructor(protected http: HttpClient) {}

  create(locationTimeSlot: LocationTimeSlot): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(locationTimeSlot);
    return this.http
      .post<LocationTimeSlot>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(locationTimeSlot: LocationTimeSlot): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(locationTimeSlot);
    return this.http
      .put<LocationTimeSlot>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<LocationTimeSlot>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<LocationTimeSlot[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(locationTimeSlot: LocationTimeSlot): LocationTimeSlot {
    const copy: LocationTimeSlot = Object.assign({}, locationTimeSlot, {
      startTime: locationTimeSlot.startTime && locationTimeSlot.startTime.isValid() ? locationTimeSlot.startTime.toJSON() : undefined,
      endTime: locationTimeSlot.endTime && locationTimeSlot.endTime.isValid() ? locationTimeSlot.endTime.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startTime = res.body.startTime ? moment(res.body.startTime) : undefined;
      res.body.endTime = res.body.endTime ? moment(res.body.endTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((locationTimeSlot: LocationTimeSlot) => {
        locationTimeSlot.startTime = locationTimeSlot.startTime ? moment(locationTimeSlot.startTime) : undefined;
        locationTimeSlot.endTime = locationTimeSlot.endTime ? moment(locationTimeSlot.endTime) : undefined;
      });
    }
    return res;
  }
}
