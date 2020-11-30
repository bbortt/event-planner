import { Invitation } from 'app/shared/model/invitation.model';

export interface Role {
  name: string;
  invitations?: Invitation[];
}
