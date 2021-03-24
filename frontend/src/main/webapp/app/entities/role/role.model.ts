import { Invitation } from 'app/entities/invitation/invitation.model';

export interface Role {
  name: string;
  invitations?: Invitation[];
}
