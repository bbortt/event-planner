import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

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
import { ISchedulerSection, SchedulerSection } from 'app/shared/model/scheduler/section.scheduler';
import SchedulerInformation from 'app/shared/model/scheduler/scheduler-information';

import { VIEWER } from 'app/shared/constants/role.constants';
import { AUTHORITY_ADMIN } from 'app/shared/constants/authority.constants';
import { DEFAULT_CELL_DURATION } from 'app/app.constants';

import * as moment from 'moment';

@Component({
  selector: 'app-project-screenplay-location',
  templateUrl: './project-screenplay-location.component.html',
  styleUrls: ['./project-screenplay-location.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectScreenplayLocationComponent implements OnInit {
  @Input()
  public location?: Location;

  @Input()
  public cellDuration = DEFAULT_CELL_DURATION;

  public project?: Project;

  public isViewer = true;
  public schedulerInformation: SchedulerInformation = { allowDeleting: false };

  private originalSections: Section[] = [];

  public events: ISchedulerEvent[] = [];
  public sections: ISchedulerSection[] = [];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private accountService: AccountService,
    private sectionService: SectionService,
    private eventService: EventService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit(): void {
    this.project = this.location!.project;

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

  // TODO: This will be done in the screenplay-filter, move to `@Input()` attribute then
  calculateInterval(): number {
    return this.project!.endTime.diff(this.project!.startTime, 'days') + 1;
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
