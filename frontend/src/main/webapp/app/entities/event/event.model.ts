import { Responsibility } from 'app/entities/responsibility/responsibility.model';
import { Section } from 'app/entities/section/section.model';

import { Moment } from 'moment';

export interface Event {
  id?: number;
  name: string;
  description?: string;
  startTime: Moment;
  endTime: Moment;
  section: Section;
  responsibility?: Responsibility;
  jhiUserId?: string;
}
