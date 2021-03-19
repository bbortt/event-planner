import { Project } from './project.model';
import { Responsibility } from './responsibility.model';
import { Section } from './section.model';
import { User } from 'app/core/user/user.model';

export interface Location {
  id?: number;
  name: string;
  project: Project;
  sections?: Section[];
  responsibility?: Responsibility;
  user?: User;
}
