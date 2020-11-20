import { Project } from 'app/shared/model/project.model';
import { User } from 'app/core/user/user.model';
import { Role } from 'app/shared/model/role.model';
import { Responsibility } from 'app/shared/model/responsibility.model';

export interface Invitation {
  id?: number;
  email?: string;
  accepted?: boolean;
  project?: Project;
  user?: User;
  role?: Role;
  responsibility?: Responsibility;
}
