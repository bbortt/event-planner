import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

import { EventHistory } from 'app/entities/event-history/event-history.model';
import { Project } from 'app/entities/project/project.model';

import * as dayjs from 'dayjs';

type EntityResponseType = HttpResponse<EventHistory>;
type EntityArrayResponseType = HttpResponse<EventHistory[]>;

@Injectable({ providedIn: 'root' })
export class EventHistoryService {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/events/history');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<EventHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(project: Project, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<EventHistory[]>(`${this.resourceUrl}/projects/${project.id!}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  convertDates(eventHistory: EventHistory): EventHistory {
    eventHistory.startTime = dayjs(eventHistory.startTime);
    eventHistory.endTime = dayjs(eventHistory.endTime);
    eventHistory.createdDate = dayjs(eventHistory.createdDate);
    return eventHistory;
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
}
