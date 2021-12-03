// @flow
import { User } from '@auth0/auth0-spa-js';

export type memberAction = memberApproveAction;

export const memberApproveType = 'member:approve';

export type memberApproveAction = { type: 'member:approve', payload: { id: number } };

export const memberApprove = (id: number): memberApproveAction => ({
  type: 'member:approve',
  payload: { id },
});
