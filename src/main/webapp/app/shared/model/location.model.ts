import { Project } from 'app/shared/model/project.model';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { Section } from 'app/shared/model/section.model';
import { User } from 'app/core/user/user.model';

export interface Location {
  id?: number;
  name: string;
  project: Project;
  sections?: Section[];
  responsibility?: Responsibility;
  user?: User;
}
