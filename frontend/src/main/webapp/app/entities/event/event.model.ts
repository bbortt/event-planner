import { Responsibility } from 'app/entities/responsibility/responsibility.model';
import { Section } from 'app/entities/section/section.model';
import { User } from 'app/entities/user/user.model';

import { Dayjs } from 'dayjs';

export interface Event {
  id?: number;
  name: string;
  description?: string;
  startTime: Dayjs;
  endTime: Dayjs;
  section: Section;
  responsibility?: Responsibility;
  user?: User;
}
