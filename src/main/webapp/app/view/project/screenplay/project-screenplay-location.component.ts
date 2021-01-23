import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'app/core/auth/account.service';

import { JhiEventManager } from 'ng-jhipster';

import { AppointmentEvent } from 'app/shared/model/scheduler/appointment-event';

import { EventService } from 'app/entities/event/event.service';
import { SectionService } from 'app/entities/section/section.service';

import { Event } from 'app/shared/model/event.model';
import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';
import { Section } from 'app/shared/model/section.model';

import { ISchedulerEvent, SchedulerEvent } from 'app/shared/model/scheduler/event.scheduler';
import { ISchedulerResponsibility } from 'app/shared/model/scheduler/responsibility.scheduler';
import { ISchedulerSection, SchedulerSection } from 'app/shared/model/scheduler/section.scheduler';
import SchedulerInformation from 'app/shared/model/scheduler/scheduler-information';

import {
  ROUTE_CELL_DURATION_PARAMETER_NAME,
  ROUTE_FROM_PARAMETER_NAME,
  ROUTE_INTERVAL_PARAMETER_NAME,
} from 'app/view/project/screenplay/filter/project-screenplay-filter.component';

import { VIEWER } from 'app/shared/constants/role.constants';
import { AUTHORITY_ADMIN } from 'app/shared/constants/authority.constants';
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
  public location?: Location;
  @Input()
  public responsibilities?: ISchedulerResponsibility[];

  schedulerStartDate?: Date;
  cellDuration?: number;
  interval?: number;

  public project?: Project;

  public isViewer = true;
  public schedulerInformation: SchedulerInformation = { allowDeleting: false };

  private originalSections: Section[] = [];

  public events: ISchedulerEvent[] = [];
  public sections: ISchedulerSection[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private accountService: AccountService,
    private sectionService: SectionService,
    private eventService: EventService,
    private eventManager: JhiEventManager
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
        this.cellDuration = cellDuration || this.cellDuration || DEFAULT_SCHEDULER_CELL_DURATION;
        this.schedulerStartDate = from ? moment(from).toDate() : this.schedulerStartDate || this.project!.startTime.toDate();
        this.interval = interval || this.interval || this.project!.endTime.diff(this.project!.startTime, 'days') + 1;
      });

    this.reset();

    this.isViewer =
      !this.accountService.hasAnyAuthority(AUTHORITY_ADMIN) &&
      (!this.project || this.accountService.hasAnyRole(this.project.id!, VIEWER.name));

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

  private reset(): void {
    let sections: ISchedulerSection[] = [];
    const events: ISchedulerEvent[] = [];

    this.sectionService.findAllByLocationInclusiveEvents(this.location!).subscribe((response: HttpResponse<Section[]>) => {
      const data = response.body || [];
      sections = data.map(this.toSection);
      data.forEach((section: Section) => {
        if (section.events) {
          events.push(...section.events.map((event: Event) => this.toEvent(section, event)));
        }
      });

      this.originalSections = data;

      this.sections = sections;
      this.events = events;
    });
  }

  private toSection(section: Section): ISchedulerSection {
    return new SchedulerSection(section);
  }

  private toEvent(section: Section, event: Event): ISchedulerEvent {
    return new SchedulerEvent(section, event);
  }

  configureAppointmentForm(e: AppointmentEvent): void {
    // Cancel devextreme form
    e.cancel = true;

    const event = this.fromEvent(e.appointmentData);
    const startTime = event.startTime.toJSON();
    const endTime = event.endTime.toJSON();

    const route = ['projects', this.project!.id!, 'locations', this.location!.id!, 'sections', event.sections![0].id, 'events'];
    if (event.id) {
      route.push(event.id, 'edit');
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
    const appointment = e.appointmentData;

    this.eventService.update(this.fromEvent(appointment)).subscribe(
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

    const event = this.fromEvent(e.appointmentData);

    const route = ['projects', this.project!.id!, 'locations', this.location!.id!, 'sections', event.sections![0].id, 'events', event.id!];
    this.router.navigate([{ outlets: { modal: route } }]);
  }

  fromEvent(event: ISchedulerEvent): Event {
    const updatedEvent = {
      name: event.text,
      description: event.description,
      startTime: moment(event.startDate),
      endTime: moment(event.endDate),
      sections: [this.sectionById(event.sectionId)],
    };

    if (event.responsibility) {
      if (event.responsibility.isResponsibility) {
        updatedEvent['responsibility'] = event.responsibility.originalValue;
      } else {
        updatedEvent['user'] = event.responsibility.originalValue;
      }
    }

    return { ...event.originalEvent, ...updatedEvent };
  }

  private sectionById(sectionId: number): Section {
    return this.originalSections.find((section: Section) => section.id === sectionId)!;
  }
}
