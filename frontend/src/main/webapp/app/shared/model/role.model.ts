import { Invitation } from './invitation.model';

export interface Role {
  name: string;
  invitations?: Invitation[];
}
