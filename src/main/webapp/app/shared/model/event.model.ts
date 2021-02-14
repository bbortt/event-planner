import { Moment } from 'moment';
import { Section } from 'app/shared/model/section.model';
import { Responsibility } from 'app/shared/model/responsibility.model';
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
