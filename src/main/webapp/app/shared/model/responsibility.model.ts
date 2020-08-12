import { IProject } from 'app/shared/model/project.model';
import { IInvitation } from 'app/shared/model/invitation.model';
import { ILocation } from 'app/shared/model/location.model';
import { IEvent } from 'app/shared/model/event.model';

export interface IResponsibility {
  id?: number;
  name?: string;
  project?: IProject;
  invitations?: IInvitation[];
  locations?: ILocation[];
  events?: IEvent[];
}

export class Responsibility implements IResponsibility {
  constructor(
    public id?: number,
    public name?: string,
    public project?: IProject,
    public invitations?: IInvitation[],
    public locations?: ILocation[],
    public events?: IEvent[]
  ) {}
}
