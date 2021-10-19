// @flow
import { User } from '@auth0/auth0-spa-js';

export type invitationAction = invitationAcceptAction;

export const invitationAcceptType = 'invitation:accept';

export type invitationAcceptAction = { type: 'invitation:accept', payload: { token: string, user: typeof User } };

export const invitationAccept = (token: string, user: typeof User): invitationAcceptAction => ({
  type: 'invitation:accept',
  payload: { token, user },
});
