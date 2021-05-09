import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

import { Location } from 'app/entities/location/location.model';
import { Project } from 'app/entities/project/project.model';

import { SchedulerColorGroup } from 'app/entities/dto/scheduler-color-group.model';
import { SchedulerEvent } from 'app/entities/dto/scheduler-event.model';
import { SchedulerLocation } from 'app/entities/dto/scheduler-location.model';

import * as dayjs from 'dayjs';

@Injectable({ providedIn: 'root' })
export class SchedulerService {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/scheduler');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

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
      if (schedulerEvent.originalEvent) {
        schedulerEvent.originalEvent.startTime = dayjs(schedulerEvent.originalEvent.startTime);
        schedulerEvent.originalEvent.endTime = dayjs(schedulerEvent.originalEvent.endTime);
      }
    });
    return data;
  }
}
