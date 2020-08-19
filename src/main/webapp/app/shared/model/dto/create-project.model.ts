import { Moment } from 'moment';

export interface ICreateProject {
  name: string;
  startTime: Moment;
  endTime: Moment;
  description?: string;
  emailOrLogin?: string;
}

export class CreateProject implements ICreateProject {
  constructor(
    public name: string,
    public startTime: Moment,
    public endTime: Moment,
    public description?: string,
    public emailOrLogin?: string
  ) {}
}
