import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EventService } from 'app/entities/event/event.service';
import { ResponsibilityService } from 'app/entities/responsibility/responsibility.service';
import { SectionService } from 'app/entities/section/section.service';
import { UserService } from 'app/core/user/user.service';

import { Event } from 'app/shared/model/event.model';
import { Location } from 'app/shared/model/location.model';
import { Project } from 'app/shared/model/project.model';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { Section } from 'app/shared/model/section.model';
import { User } from 'app/core/user/user.model';

import { ISchedulerEvent, SchedulerEvent } from 'app/shared/model/scheduler/event.scheduler';
import { ISchedulerSection, SchedulerSection } from 'app/shared/model/scheduler/section.scheduler';
import { AppointmentEvent } from 'app/shared/model/scheduler/appointment-event';

import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import * as moment from 'moment';

const RESPONSIBILITY = 'ProjectScreenplayLocationComponent.responsibility';
const USER = 'ProjectScreenplayLocationComponent.user';

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

  private responsibilities: Responsibility[] = [];
  private users: User[] = [];

  public events: ISchedulerEvent[] = [];
  public sections: ISchedulerSection[] = [];

  isResponsibility = true;
  responsiblityForm: FormGroup;

  constructor(
    private translateService: TranslateService,
    private responsibilityService: ResponsibilityService,
    private userService: UserService,
    private sectionService: SectionService,
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.responsiblityForm = fb.group({
      responsibility: [],
      responsibilityAutocomplete: [],
      user: [],
      userAutocomplete: [],
    });
  }

  ngOnInit(): void {
    this.project = this.location?.project;
    this.reset();

    // TODO: Load in parent
    this.responsibilityService
      .findAllByProject(this.project!)
      .subscribe((response: HttpResponse<Responsibility[]>) => (this.responsibilities = response.body || []));

    // TODO: Load in parent
    this.userService.findAllByProject(this.project!).subscribe((response: HttpResponse<User[]>) => (this.users = response.body || []));
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
    let textTranslation = '';
    this.translate('eventPlannerApp.event.name', (translation: string) => (textTranslation = translation));
    e.form.itemOption('mainGroup').items.find((item: any) => item.dataField === 'text').label.text = textTranslation;
    e.form.itemOption('mainGroup.text', 'isRequired', true);

    // Date-Time picker formatting
    e.form.itemOption('mainGroup').items[1].items[0].editorOptions.displayFormat = DATE_TIME_FORMAT;
    e.form.itemOption('mainGroup').items[1].items[2].editorOptions.displayFormat = DATE_TIME_FORMAT;

    // Remove "all-day" and "repeatable"
    e.form.itemOption('mainGroup').items.splice(2, 1);

    // Remove empty "dividers"
    e.form.itemOption('mainGroup').items.splice(2, 1);
    e.form.itemOption('mainGroup').items.splice(3, 1);

    // Style `Section` dropdown
    let sectionTranslation = '';
    this.translate('eventPlannerApp.event.section', (translation: string) => (sectionTranslation = translation));
    const sectionControl = e.form.itemOption('mainGroup').items.find((item: any) => item.dataField === 'sectionId');
    sectionControl.label.text = sectionTranslation;
    sectionControl.colSpan = 2;

    // Create `Responsibility` or `User` switch
    let responsibilityTranslation = '';
    this.translate('eventPlannerApp.event.responsibility', (translation: string) => (responsibilityTranslation = translation));
    let userTranslation = '';
    this.translate('eventPlannerApp.event.user', (translation: string) => (userTranslation = translation));
    const responsibilityOrUserField = {
      dataField: 'responsibilityOrUser',
      label: {
        // TODO: No label?
        text: '',
      },
      editorType: 'dxRadioGroup',
      editorOptions: {
        items: [
          { key: RESPONSIBILITY, text: responsibilityTranslation },
          {
            key: USER,
            text: userTranslation,
          },
        ],
        value: RESPONSIBILITY,
        onValueChanged: ($event: any) => this.onResponsibilityOrUser($event),
      },
      colSpan: 2,
    };

    // "Search" translation
    let searchTranslation = '';
    this.translate('global.form.search', (translation: string) => (searchTranslation = translation));

    // `Responsibility` autocomplete field
    const responsibilityField = {
      dataField: 'responsibility',
      label: {
        text: responsibilityTranslation,
      },
      editorType: 'dxAutocomplete',
      colSpan: 2,
      editorOptions: {
        class: 'dx-form-control',
        formControl: this.responsiblityForm.get('responsibilityAutocomplete')!,
        placeholder: searchTranslation,
        dataSource: this.responsibilities,
        valueExpr: 'name',
        onSelectionChanged: ($event: any) => this.responsibilitySelected($event),
        showClearButton: true,
        isValid: this.isValidAutocomplete('responsibility'),
      },
    };

    // `Responsibility` autocomplete field
    const userField = {
      dataField: 'user',
      label: {
        text: userTranslation,
      },
      editorType: 'dxAutocomplete',
      colSpan: 2,
      editorOptions: {
        class: 'dx-form-control',
        formControl: this.responsiblityForm.get('userAutocomplete')!,
        placeholder: searchTranslation,
        dataSource: this.users,
        valueExpr: 'email',
        onSelectionChanged: ($event: any) => this.userSelected($event),
        showClearButton: true,
        isValid: this.isValidAutocomplete('user'),
      },
    };

    // Adapt form to our needs
    e.form.option('showRequiredMark', false);
    e.form.option('items', [
      ...e.form.option('items'),
      /* TODO: Append `Responsibility` / `User` */
      responsibilityOrUserField,
      responsibilityField,
      userField,
    ]);
  }

  private translate(key: string, callback: (translation: string) => void): void {
    this.translateService.get(key).subscribe((translation: string) => callback(translation));
  }

  private onResponsibilityOrUser($event: any): void {
    this.isResponsibility = $event.value.key === RESPONSIBILITY;
  }

  private responsibilitySelected($event: any): void {
    this.responsiblityForm.get('responsibility')!.setValue($event.selectedItem);
  }

  private userSelected($event: any): void {
    this.responsiblityForm.get('user')!.setValue($event.selectedItem);
  }

  private isValidAutocomplete(name: string): boolean {
    return !(
      this.responsiblityForm.get(name)!.invalid &&
      (this.responsiblityForm.get(name)!.dirty || this.responsiblityForm.get(name)!.touched)
    );
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
    // eslint-disable-next-line no-console
    console.log('appointment updated: ', e.appointmentData);

    // const appointment = e.appointmentData;
    //
    // this.eventService.update(this.fromEvent(appointment)).subscribe(
    //   (response: HttpResponse<Event>) => {
    //     if (response.status !== 200) {
    //       this.reset();
    //     }
    //   },
    //   () => this.reset()
    // );
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
