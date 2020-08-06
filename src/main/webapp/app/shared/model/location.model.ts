import { Moment } from 'moment';
import { IProject } from 'app/shared/model/project.model';
import { IResponsibility } from 'app/shared/model/responsibility.model';
import { ISection } from 'app/shared/model/section.model';

export interface ILocation {
  id?: number;
  name?: string;
  dateFrom?: Moment;
  dateTo?: Moment;
  project?: IProject;
  responsibility?: IResponsibility;
  sections?: ISection[];
}

export class Location implements ILocation {
  constructor(
    public id?: number,
    public name?: string,
    public dateFrom?: Moment,
    public dateTo?: Moment,
    public project?: IProject,
    public responsibility?: IResponsibility,
    public sections?: ISection[]
  ) {}
}
