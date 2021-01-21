import { ISchedulerResponsibility, SchedulerResponsibility } from 'app/shared/model/scheduler/responsibility.scheduler';

import { Event } from 'app/shared/model/event.model';
import { Section } from 'app/shared/model/section.model';

import { DEFAULT_SCHEDULER_RESPONSIBILITY_ID } from 'app/app.constants';

export interface ISchedulerEvent {
  text: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  sectionId: number;
  responsibilityId: number;
  responsibility?: ISchedulerResponsibility;
  originalEvent?: Event;
}

export class SchedulerEvent implements ISchedulerEvent {
  text: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  sectionId: number;
  responsibilityId: number;
  responsibility?: ISchedulerResponsibility;
  originalEvent?: Event;

  constructor(section: Section, event: Event) {
    this.text = event.name;
    this.description = event.description;
    this.startDate = event.startTime.toDate();
    this.endDate = event.endTime.toDate();
    this.sectionId = section.id!;
    this.responsibilityId = event.responsibility?.id || event.user?.id || DEFAULT_SCHEDULER_RESPONSIBILITY_ID;

    if (event.responsibility) {
      this.responsibility = new SchedulerResponsibility(event.responsibility, true);
    } else if (event.user) {
      this.responsibility = new SchedulerResponsibility(event.user, false);
    }

    this.originalEvent = event;
  }
}
