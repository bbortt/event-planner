import { Event } from 'app/shared/model/event.model';
import { Section } from 'app/shared/model/section.model';

export interface ISchedulerEvent {
  text: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  sectionId: number;
  originalEvent?: Event;
}

export class SchedulerEvent implements ISchedulerEvent {
  text: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  sectionId: number;
  originalEvent?: Event;

  constructor(section: Section, event: Event) {
    this.text = event.name!;
    this.description = event.description;
    this.startDate = event.startTime!.toDate();
    this.endDate = event.endTime!.toDate();
    this.sectionId = section.id!;
    this.originalEvent = event;
  }
}
