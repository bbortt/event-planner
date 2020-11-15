import { Moment } from 'moment';
import { Responsibility } from 'app/shared/model/responsibility.model';
import { Invitation } from 'app/shared/model/invitation.model';
import { Location } from 'app/shared/model/location.model';

export interface Project {
  id?: number;
  name?: string;
  description?: string;
  startTime?: Moment;
  endTime?: Moment;
  responsibilities?: Responsibility[];
  invitations?: Invitation[];
  locations?: Location[];
}
