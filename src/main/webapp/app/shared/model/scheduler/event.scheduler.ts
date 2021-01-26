import { Event } from 'app/shared/model/event.model';

export interface ISchedulerEvent {
  text: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  colorId: number;
  color: string;
  sectionId: number;
  originalEvent?: Event;
}
