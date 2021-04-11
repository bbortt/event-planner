import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { AppointmentEvent } from 'app/entities/scheduler/appointment-event';

import { EventService } from 'app/entities/event/event.service';
import { SchedulerService } from 'app/entities/scheduler/scheduler.service';

import { Event } from 'app/entities/event/event.model';
import { Location } from 'app/entities/location/location.model';
import { Project } from 'app/entities/project/project.model';

import { SchedulerColorGroup } from 'app/entities/dto/scheduler-color-group.model';
import { SchedulerEvent } from 'app/entities/dto/scheduler-event.model';
import { SchedulerLocation } from 'app/entities/dto/scheduler-location.model';
import { SchedulerSection } from 'app/entities/dto/scheduler-section.model';
import SchedulerInformation from 'app/entities/scheduler/scheduler-information';

import {
  ROUTE_CELL_DURATION_PARAMETER_NAME,
  ROUTE_FROM_PARAMETER_NAME,
  ROUTE_INTERVAL_PARAMETER_NAME,
} from 'app/view/project/screenplay/filter/project-screenplay-filter.component';

import { Authority } from 'app/config/authority.constants';
import { Role } from 'app/config/role.constants';

import { DEFAULT_SCHEDULER_CELL_DURATION } from 'app/app.constants';

import * as moment from 'moment';

@Component({
  selector: 'app-project-screenplay-location',
  templateUrl: './project-screenplay-location.component.html',
  styleUrls: ['./project-screenplay-location.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectScreenplayLocationComponent implements OnInit, OnDestroy {
  @Input()
  location?: Location;

  schedulerStartDate?: Date;
  cellDuration?: number;
  interval?: number;

  project?: Project;

  isViewer = true;
  schedulerInformation: SchedulerInformation = { allowDeleting: false };

  events: SchedulerEvent[] = [];
  sections: SchedulerSection[] = [];
  colors: SchedulerColorGroup[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private accountService: AccountService,
    private schedulerService: SchedulerService,
    private eventService: EventService,
    private eventManager: EventManager
  ) {}

  ngOnInit(): void {
    this.project = this.location!.project;

    this.activatedRoute.queryParams
      .pipe(
        map((params: Params) => ({
          cellDuration: params[ROUTE_CELL_DURATION_PARAMETER_NAME],
          from: params[ROUTE_FROM_PARAMETER_NAME],
          interval: params[ROUTE_INTERVAL_PARAMETER_NAME],
        })),
        takeUntil(this.destroy$)
      )
      .subscribe(({ cellDuration, from, interval }: { cellDuration?: number; from?: Date; interval?: number }) => {
        this.cellDuration = cellDuration ?? this.cellDuration ?? DEFAULT_SCHEDULER_CELL_DURATION;
        this.schedulerStartDate = from ? moment(from).toDate() : this.schedulerStartDate ?? this.project!.startTime.toDate();
        this.interval = interval ?? this.interval ?? this.project!.endTime.diff(this.project!.startTime, 'days') + 1;
      });

    this.reset();

    this.isViewer =
      !this.accountService.hasAnyAuthority(Authority.ADMIN) && this.accountService.hasAnyRole(this.project.id!, Role.VIEWER.name);

    this.schedulerInformation = {
      ...this.schedulerInformation,
      allowAdding: !this.isViewer,
      allowDragging: !this.isViewer,
    };

    this.eventManager.subscribe(`eventListModificationInLocation${this.location!.id!}`, () => this.reset());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  configureAppointmentForm(e: AppointmentEvent): void {
    // Cancel devextreme form
    e.cancel = true;

    const event = e.appointmentData;
    const startTime = moment(event.startDate).toJSON();
    const endTime = moment(event.endDate).toJSON();

    const route = ['projects', this.project!.id!, 'locations', this.location!.id!, 'sections', event.sectionId, 'events'];
    if (event.originalEvent) {
      route.push(event.originalEvent.id!, 'edit');
    } else {
      route.push('new');
    }

    this.router.navigate([{ outlets: { modal: route } }], {
      queryParams: { startTime, endTime },
    });
  }

  /*
   * This is for the 'drag & drop' update (times only). Any click on an item results in `this.configureAppointmentForm` beeing called.
   */
  onAppointmentDragged(e: AppointmentEvent): void {
    this.eventService.update(this.updateDraggedEvent(e.appointmentData)).subscribe(
      (response: HttpResponse<Event>) => {
        if (response.status !== 200) {
          this.reset();
        }
      },
      () => this.reset()
    );
  }

  /*
   * Open `Event` details instead of the devextreme tooltip.
   */
  openEventDetails(e: AppointmentEvent): void {
    // Cancel devextreme tooltip
    e.cancel = true;

    const event = e.appointmentData;
    const route = [
      'projects',
      this.project!.id!,
      'locations',
      this.location!.id!,
      'sections',
      event.sectionId,
      'events',
      event.originalEvent!.id,
    ];
    this.router.navigate([{ outlets: { modal: route } }]);
  }

  updateDraggedEvent(event: SchedulerEvent): Event {
    const updatedEvent = {
      startTime: moment(event.startDate),
      endTime: moment(event.endDate),
    };

    return { ...event.originalEvent, ...updatedEvent } as Event;
  }

  private reset(): void {
    this.schedulerService.getSchedulerInformation(this.location!).subscribe((data: SchedulerLocation) => {
      const { events, sections, colorGroups } = data;
      this.resetData(events, sections, colorGroups);
    });
  }

  private resetData(events: SchedulerEvent[], sections: SchedulerSection[], colors: SchedulerColorGroup[]): void {
    this.events = events;
    this.sections = sections;
    this.colors = colors;
  }
}
