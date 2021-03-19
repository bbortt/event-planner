import { Project } from './project.model';
import { User } from 'app/core/user/user.model';
import { Role } from './role.model';
import { Responsibility } from './responsibility.model';

export interface Invitation {
  id?: number;
  email: string;
  accepted: boolean;
  token?: string;
  color?: string;
  project: Project;
  user?: User;
  role: Role;
  responsibility?: Responsibility;
}
