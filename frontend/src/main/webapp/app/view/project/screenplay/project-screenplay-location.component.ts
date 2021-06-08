import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { AppointmentEvent } from 'app/entities/scheduler/appointment-event';

import { EventService } from 'app/entities/event/event.service';
import { SchedulerService } from 'app/entities/scheduler/scheduler.service';
import { SectionService } from 'app/entities/section/section.service';

import { Event } from 'app/entities/event/event.model';
import { Location } from 'app/entities/location/location.model';
import { Project } from 'app/entities/project/project.model';

import { SchedulerColorGroup } from 'app/entities/dto/scheduler-color-group.model';
import { SchedulerEvent } from 'app/entities/dto/scheduler-event.model';
import { SchedulerInformation } from 'app/entities/scheduler/scheduler-information';
import { SchedulerLocation } from 'app/entities/dto/scheduler-location.model';
import { SchedulerSection } from 'app/entities/dto/scheduler-section.model';

import {
  ROUTE_CELL_DURATION_PARAMETER_NAME,
  ROUTE_FROM_PARAMETER_NAME,
  ROUTE_INTERVAL_PARAMETER_NAME,
} from 'app/view/project/screenplay/filter/project-screenplay-filter.component';

import { Authority } from 'app/config/authority.constants';
import { Role } from 'app/config/role.constants';

import { DEFAULT_SCHEDULER_CELL_DURATION } from 'app/app.constants';

import * as dayjs from 'dayjs';
import { Section } from 'app/entities/section/section.model';

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
  schedulerInformation: SchedulerInformation = { allowDeleting: !this.isViewer };

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
    private sectionService: SectionService,
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
        this.schedulerStartDate = from ? dayjs(from).toDate() : this.schedulerStartDate ?? this.project!.startTime.toDate();
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

  configureAppointmentForm(appointmentEvent: AppointmentEvent): void {
    // Cancel devextreme form
    appointmentEvent.cancel = true;

    const event = appointmentEvent.appointmentData;
    const startTime = dayjs(event.startDate).toJSON();
    const endTime = dayjs(event.endDate).toJSON();

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
   * This is for the 'drag & drop' update (times only). Any click on an item results in `this.configureAppointmentForm` being called.
   */
  onAppointmentDragged(appointmentEvent: AppointmentEvent): void {
    this.updateDraggedEvent(appointmentEvent.appointmentData)
      .pipe(switchMap((event: Event) => this.eventService.update(event)))
      .subscribe(
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
  openEventDetails(appointmentEvent: AppointmentEvent): void {
    // Cancel devextreme tooltip
    appointmentEvent.cancel = true;

    const event = appointmentEvent.appointmentData;
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

  private updateDraggedEvent(schedulerEvent: SchedulerEvent): Observable<Event> {
    return of(schedulerEvent).pipe(
      map(
        (event: SchedulerEvent) =>
          ({
            startTime: dayjs(event.startDate),
            endTime: dayjs(event.endDate),
            section: event.originalEvent?.section,
          } as Event)
      ),
      map((updatedEvent: Event) => ({ ...schedulerEvent.originalEvent, ...updatedEvent })),
      switchMap((updatedEvent: Event) =>
        schedulerEvent.sectionId === schedulerEvent.originalEvent?.section.id
          ? of(updatedEvent)
          : this.sectionService.find(schedulerEvent.sectionId).pipe(
              catchError(() => of({ body: schedulerEvent.originalEvent?.section } as HttpResponse<Section>)),
              switchMap((response: HttpResponse<Section>) => {
                if (response.body) {
                  updatedEvent.section = response.body;
                }

                return of(updatedEvent);
              })
            )
      )
    );
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
