import { Moment } from 'moment';
import { Responsibility } from './responsibility.model';
import { Invitation } from './invitation.model';
import { Location } from './location.model';

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
