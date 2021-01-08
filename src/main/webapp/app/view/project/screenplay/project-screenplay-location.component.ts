import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

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

import * as moment from 'moment';

@Component({
  selector: 'app-project-screenplay-location',
  templateUrl: './project-screenplay-location.component.html',
  styleUrls: ['./project-screenplay-location.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectScreenplayLocationComponent implements OnInit {
  @Input()
  location?: Location;

  project?: Project;

  public events: ISchedulerEvent[] = [];
  public sections: ISchedulerSection[] = [];

  constructor(
    private translateService: TranslateService,
    private sectionService: SectionService,
    private eventService: EventService,
    private eventManager: JhiEventManager,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.project = this.location!.project;
    this.reset();

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

  // TODO: This will be done in the screenplay-filter
  calculateInterval(): number {
    return this.project!.endTime.diff(this.project!.startTime, 'days') + 1;
  }

  configureAppointmentForm(e: any): void {
    const event = this.fromEvent(e.appointmentData);

    const route = ['projects', this.project!.id!, 'locations', this.location!.id!, 'sections', event.sections![0].id, 'events'];
    if (event.id) {
      route.push(event.id, 'edit');
    } else {
      route.push('new');
    }

    const { startTime, endTime } = event;
    this.router.navigate([{ outlets: { modal: route } }], {
      queryParams: { startTime, endTime },
    });

    // Cancel devextreme form
    e.cancel = true;
  }

  /*
   * This is for the "drag & drop" update (times only). Any click on an item results in `this.configureAppointmentForm` beeing called.
   */
  onAppointmentUpdated(e: AppointmentEvent): void {
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

  private fromEvent(event: ISchedulerEvent): Event {
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
    return this.sections.find((section: Section) => section.id === sectionId)!;
  }
}
