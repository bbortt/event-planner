import { Responsibility } from 'app/entities/responsibility/responsibility.model';
import { Invitation } from 'app/entities/invitation/invitation.model';

import { Moment } from 'moment';

export interface Project {
  id?: number;
  name: string;
  description?: string;
  startTime: Moment;
  endTime: Moment;
  archived: boolean;
  responsibilities?: Responsibility[];
  invitations?: Invitation[];
  locations?: Location[];
}
