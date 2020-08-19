import { Moment } from 'moment';
import { IUser } from '../../../core/user/user.model';

export interface ICreateProject {
  name: string;
  startTime: Moment;
  endTime: Moment;
  description?: string;
  user?: IUser;
}

export class CreateProject implements ICreateProject {
  constructor(public name: string, public startTime: Moment, public endTime: Moment, public description?: string, public user?: IUser) {}
}
