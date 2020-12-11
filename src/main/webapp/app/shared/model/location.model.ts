import { Project } from 'app/shared/model/project.model';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { Section } from 'app/shared/model/section.model';

export interface Location {
  id?: number;
  name: string;
  project: Project;
  responsibility?: Responsibility;
  sections?: Section[];
}
