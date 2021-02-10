import { Section } from 'app/shared/model/section.model';

export interface SchedulerSection {
  id: number;
  text: string;
  description: string;
  originalSection: Section;
}
