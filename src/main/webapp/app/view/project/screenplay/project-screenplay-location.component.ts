import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import { EventService } from 'app/entities/event/event.service';
import { SectionService } from 'app/entities/section/section.service';

import { Event } from 'app/shared/model/event.model';
import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';
import { Section } from 'app/shared/model/section.model';

import { ISchedulerEvent, SchedulerEvent } from 'app/shared/model/scheduler/event.scheduler';
import { ISchedulerSection, SchedulerSection } from 'app/shared/model/scheduler/section.scheduler';
import { AppointmentEvent } from 'app/shared/model/scheduler/appointment-event';

import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

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

  constructor(private translateService: TranslateService, private sectionService: SectionService, private eventService: EventService) {}

  ngOnInit(): void {
    this.project = this.location?.project;
    this.reset();
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
    // Make 'text' mandatory field and set name according to `Event`
    this.translateService
      .get('eventPlannerApp.event.name')
      .subscribe(
        (translation: string) =>
          (e.form.itemOption('mainGroup').items.find((item: any) => item.dataField === 'text').label.text = translation)
      );
    e.form.itemOption('mainGroup.text', 'isRequired', true);

    // Date-Time picker formatting
    e.form.itemOption('mainGroup').items[1].items[0].editorOptions.displayFormat = DATE_TIME_FORMAT;
    e.form.itemOption('mainGroup').items[1].items[2].editorOptions.displayFormat = DATE_TIME_FORMAT;

    // Adapt form to our needs
    e.form.option('showRequiredMark', false);
    e.form.option('items', [...e.form.option('items') /* TODO: Append `Responsibility` / `User` */]);
  }

  onAppointmentAdded(e: AppointmentEvent): void {
    const appointment = e.appointmentData;
    const eventIndex = this.events.findIndex((event: ISchedulerEvent) => !(event instanceof SchedulerEvent));

    this.eventService.create(this.fromEvent(appointment)).subscribe(
      (response: HttpResponse<Event>) => {
        const event = response.body;

        if (response.status !== 201) {
          this.events.splice(eventIndex, 1);
        } else if (event) {
          this.events[eventIndex] = this.toEvent(event.sections![0], event);
        }
      },
      () => this.events.splice(eventIndex, 1)
    );
  }

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

  onAppointmentDeleted(e: AppointmentEvent): void {
    const appointment = e.appointmentData;

    this.eventService.delete(this.fromEvent(e.appointmentData).id!).subscribe(
      (response: HttpResponse<{}>) => {
        if (response.status !== 204) {
          this.events.push(appointment);
        }
      },
      () => this.events.push(appointment)
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

    return { ...event.originalEvent, ...updatedEvent };
  }

  private sectionById(sectionId: number): Section {
    return this.sections.find((section: Section) => section.id === sectionId)!;
  }
}
