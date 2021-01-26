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

import { ISchedulerEvent } from 'app/shared/model/scheduler/event.scheduler';
import { ISchedulerSection } from 'app/shared/model/scheduler/section.scheduler';
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
import { ColorGroup } from 'app/shared/model/scheduler/color-group';

@Component({
  selector: 'app-project-screenplay-location',
  templateUrl: './project-screenplay-location.component.html',
  styleUrls: ['./project-screenplay-location.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectScreenplayLocationComponent implements OnInit, OnDestroy {
  @Input()
  public location?: Location;

  schedulerStartDate?: Date;
  cellDuration?: number;
  interval?: number;

  public project?: Project;

  public isViewer = true;
  public schedulerInformation: SchedulerInformation = { allowDeleting: false };

  public events: ISchedulerEvent[] = [];
  public sections: ISchedulerSection[] = [];
  public colors: ColorGroup[] = [];

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
    const colors: ColorGroup[] = [];

    this.sectionService.findAllByLocationInclusiveEvents(this.location!).subscribe((response: HttpResponse<ISchedulerSection[]>) => {
      const data = response.body || [];
      sections = data;
      data.forEach((section: ISchedulerSection) => {
        if (section.events) {
          section.events.forEach((event: ISchedulerEvent) => {
            if (!colors.find((colorGroup: ColorGroup) => colorGroup.color === event.color)) {
              colors.push({ id: event.colorId, color: event.color });
            }
          });
          events.push(...section.events);
        }
      });

      this.sections = sections;
      this.events = events;
      this.colors = colors;

      // eslint-disable-next-line no-console
      console.log('sections: ', this.sections);
      // eslint-disable-next-line no-console
      console.log('events: ', this.events);
    });
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

  updateDraggedEvent(event: ISchedulerEvent): Event {
    const updatedEvent = {
      startTime: moment(event.startDate),
      endTime: moment(event.endDate),
    };

    return { ...event.originalEvent!, ...updatedEvent };
  }
}
