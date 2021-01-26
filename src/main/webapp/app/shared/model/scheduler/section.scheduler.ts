import { ISchedulerEvent } from 'app/shared/model/scheduler/event.scheduler';
import { Section } from 'app/shared/model/section.model';

export interface ISchedulerSection {
  id: number;
  text: string;
  events?: ISchedulerEvent[];
  originalSection: Section;
}
