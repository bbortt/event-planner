import {Project} from 'app/entities/project/project.model';
import {Responsibility} from 'app/entities/responsibility/responsibility.model';
import {Section} from 'app/entities/section/section.model';
import {Account} from 'app/core/auth/account.model';

export interface Location {
  id?: number;
  name: string;
  project: Project;
  sections?: Section[];
  responsibility?: Responsibility;
  user?: Account;
}
