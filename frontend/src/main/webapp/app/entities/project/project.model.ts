import { Responsibility } from 'app/entities/responsibility/responsibility.model';
import { Invitation } from 'app/entities/invitation/invitation.model';

import { Dayjs } from 'dayjs';

export interface Project {
  id?: number;
  name: string;
  description?: string;
  startTime: Dayjs;
  endTime: Dayjs;
  archived: boolean;
  responsibilities?: Responsibility[];
  invitations?: Invitation[];
  locations?: Location[];
}
