import { Moment } from 'moment';
import { IResponsibility } from 'app/shared/model/responsibility.model';
import { IInvitation } from 'app/shared/model/invitation.model';

export interface IProject {
  id?: number;
  name?: string;
  description?: string;
  startTime?: Moment;
  endTime?: Moment;
  responsibilities?: IResponsibility[];
  invitations?: IInvitation[];
}

export class Project implements IProject {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public startTime?: Moment,
    public endTime?: Moment,
    public responsibilities?: IResponsibility[],
    public invitations?: IInvitation[]
  ) {}
}
