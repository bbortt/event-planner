import { Moment } from 'moment';
import { User } from 'app/core/user/user.model';

export interface ICreateProject {
  name: string;
  startTime: Moment;
  endTime: Moment;
  description?: string;
  user?: User;
}
