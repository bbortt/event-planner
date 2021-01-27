import { SchedulerEvent } from 'app/shared/model/dto/scheduler-event.model';
import { Section } from 'app/shared/model/section.model';

export interface SchedulerSection {
  id: number;
  text: string;
  events?: SchedulerEvent[];
  originalSection: Section;
}
