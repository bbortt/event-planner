import { User } from 'app/entities/user/user.model';

import { Moment } from 'moment';

export interface ICreateProject {
  name: string;
  startTime: Moment;
  endTime: Moment;
  archived: boolean;
  description?: string;
  user?: User;
}
