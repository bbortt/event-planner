import { Event } from 'app/shared/model/event.model';

export interface SchedulerEvent {
  text: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  sectionId: number;
  colorGroupId: number;
  originalEvent?: Event;
}
