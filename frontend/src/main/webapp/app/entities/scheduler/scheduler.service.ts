import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';

import { SchedulerColorGroup } from 'app/shared/model/dto/scheduler-color-group.model';
import { SchedulerEvent } from 'app/shared/model/dto/scheduler-event.model';
import { SchedulerLocation } from 'app/shared/model/dto/scheduler-location.model';

import { SERVER_API_URL } from 'app/app.constants';

import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class SchedulerService {
  public resourceUrl = SERVER_API_URL + 'api/scheduler';

  constructor(protected http: HttpClient) {}

  getSchedulerResponsibilities(project: Project): Observable<SchedulerColorGroup[]> {
    return this.http.get<SchedulerColorGroup[]>(`${this.resourceUrl}/project/${project.id!}/responsibilities`);
  }

  getSchedulerInformation(location: Location): Observable<SchedulerLocation> {
    return this.http
      .get<SchedulerLocation>(`${this.resourceUrl}/project/${location.project.id!}/location/${location.id!}`)
      .pipe(map((data: SchedulerLocation) => this.convertDTOsFromServer(data)));
  }

  protected convertDTOsFromServer(data: SchedulerLocation): SchedulerLocation {
    data.events.forEach((schedulerEvent: SchedulerEvent) => {
      schedulerEvent.originalEvent!.startTime = moment(schedulerEvent.originalEvent!.startTime);
      schedulerEvent.originalEvent!.endTime = moment(schedulerEvent.originalEvent!.endTime);
    });
    return data;
  }
}
