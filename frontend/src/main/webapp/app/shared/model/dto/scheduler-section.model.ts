import { Section } from '../section.model';

export interface SchedulerSection {
  id: number;
  text: string;
  description: string;
  originalSection: Section;
}
