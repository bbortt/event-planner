import { Project } from 'app/entities/project/project.model';
import { Role } from 'app/entities/role/role.model';
import { Responsibility } from 'app/entities/responsibility/responsibility.model';
import { User } from 'app/entities/user/user.model';

export interface Invitation {
  id?: number;
  email: string;
  accepted: boolean;
  token?: string;
  color?: string;
  project: Project;
  jhiUserId?: string;
  role: Role;
  responsibility?: Responsibility;
}
