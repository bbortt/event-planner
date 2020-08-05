import { Moment } from 'moment';
import { IProject } from 'app/shared/model/project.model';
import { IResponsibility } from 'app/shared/model/responsibility.model';

export interface ILocation {
  id?: number;
  name?: string;
  dateFrom?: Moment;
  dateTo?: Moment;
  project?: IProject;
  responsibility?: IResponsibility;
}

export class Location implements ILocation {
  constructor(
    public id?: number,
    public name?: string,
    public dateFrom?: Moment,
    public dateTo?: Moment,
    public project?: IProject,
    public responsibility?: IResponsibility
  ) {}
}
