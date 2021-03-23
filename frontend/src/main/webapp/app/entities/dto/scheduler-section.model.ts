import {Section} from 'app/entities/section/section.model';

export interface SchedulerSection {
  id: number;
  text: string;
  description: string;
  originalSection: Section;
}
