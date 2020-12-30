import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { SectionService } from 'app/entities/section/section.service';

import { Location } from 'app/shared/model/location.model';
import { Section } from 'app/shared/model/section.model';
import { Event } from 'app/shared/model/event.model';
import { ISchedulerEvent, SchedulerEvent } from 'app/shared/model/scheduler/event.scheduler';
import { Project } from 'app/shared/model/project.model';
import { ISchedulerSection, SchedulerSection } from 'app/shared/model/scheduler/section.scheduler';

@Component({
  selector: 'app-project-screenplay-location',
  templateUrl: './project-screenplay-location.component.html',
})
export class ProjectScreenplayLocationComponent implements OnInit {
  @Input()
  location?: Location;

  project?: Project;

  public currentDate = new Date();
  public events: ISchedulerEvent[] = [];
  public sections: ISchedulerSection[] = [];

  constructor(private sectionService: SectionService) {}

  ngOnInit(): void {
    this.project = this.location?.project;
    this.sectionService
      .findAllByLocationInclusiveEvents(this.location!, { sort: ['name,asc'] })
      .subscribe((response: HttpResponse<Section[]>) => {
        const data = response.body || [];
        this.sections = data.map(this.toSections);
        data.forEach((section: Section) => {
          if (section.events) {
            this.events.push(...section.events.map((event: Event) => this.toEvents(section, event)));
          }
        });
        // eslint-disable-next-line no-console
        console.log('data - sections: ', this.sections);
        // eslint-disable-next-line no-console
        console.log('data - events  : ', this.events);
      });
  }

  private toSections(section: Section): ISchedulerSection {
    return new SchedulerSection(section);
  }

  private toEvents(section: Section, event: Event): ISchedulerEvent {
    return new SchedulerEvent(section, event);
  }
}
