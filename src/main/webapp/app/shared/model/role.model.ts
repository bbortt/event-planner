import { IInvitation } from 'app/shared/model/invitation.model';

export interface IRole {
  name?: string;
  invitations?: IInvitation[];
}

export class Role implements IRole {
  constructor(public name?: string, public invitations?: IInvitation[]) {}
}
