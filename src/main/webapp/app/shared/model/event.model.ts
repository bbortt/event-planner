import { Moment } from 'moment';
import { ISection } from 'app/shared/model/section.model';
import { IResponsibility } from 'app/shared/model/responsibility.model';
import { IUser } from 'app/core/user/user.model';

export interface IEvent {
  id?: number;
  name?: string;
  description?: string;
  startTime?: Moment;
  endTime?: Moment;
  sections?: ISection[];
  responsibility?: IResponsibility;
  user?: IUser;
}

export class Event implements IEvent {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public startTime?: Moment,
    public endTime?: Moment,
    public sections?: ISection[],
    public responsibility?: IResponsibility,
    public user?: IUser
  ) {}
}
