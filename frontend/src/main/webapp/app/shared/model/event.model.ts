import { Moment } from 'moment';
import { Section } from './section.model';
import { Responsibility } from './responsibility.model';
import { User } from 'app/core/user/user.model';

export interface Event {
  id?: number;
  name: string;
  description?: string;
  startTime: Moment;
  endTime: Moment;
  section: Section;
  responsibility?: Responsibility;
  user?: User;
}
