import { Event } from 'app/shared/model/event.model';
import { Section } from 'app/shared/model/section.model';

export interface ISchedulerEvent {
  text: string;
  startDate: Date;
  endDate: Date;
  sectionId: number;
}

export class SchedulerEvent implements ISchedulerEvent {
  text: string;
  startDate: Date;
  endDate: Date;
  sectionId: number;

  constructor(section: Section, event: Event) {
    this.text = event.name!;
    this.startDate = event.startTime!.toDate();
    this.endDate = event.endTime!.toDate();
    this.sectionId = section.id!;
  }
}
