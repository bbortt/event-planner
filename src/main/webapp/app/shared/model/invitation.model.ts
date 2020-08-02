import { IProject } from 'app/shared/model/project.model';
import { IUser } from 'app/core/user/user.model';
import { IRole } from 'app/shared/model/role.model';
import { IResponsibility } from 'app/shared/model/responsibility.model';

export interface IInvitation {
  id?: number;
  email?: string;
  accepted?: boolean;
  project?: IProject;
  user?: IUser;
  role?: IRole;
  responsibility?: IResponsibility;
}

export class Invitation implements IInvitation {
  constructor(
    public id?: number,
    public email?: string,
    public accepted?: boolean,
    public project?: IProject,
    public user?: IUser,
    public role?: IRole,
    public responsibility?: IResponsibility
  ) {
    this.accepted = this.accepted || false;
  }
}
