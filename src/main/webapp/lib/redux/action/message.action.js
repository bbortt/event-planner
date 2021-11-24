// @flow
import type { calloutType } from '../../foundation/callout';
import type { Message } from '../../model/message';

export type messageAction = messageAddAction | messageDeleteAction;

export const messageAddType = 'message:add';
export const messageDeleteType = 'message:delete';

export type messageAddAction = { type: 'message:add', payload: { message: Message } };
export type messageDeleteAction = { type: 'message:delete', payload: { id: number } };

export const messageAdd = (type: calloutType, message: string, title?: string): messageAddAction => ({
  type: 'message:add',
  payload: { message: { id: new Date().getTime(), title, message, type } },
});
export const messageDelete = (id: number): messageDeleteAction => ({
  type: 'message:delete',
  payload: { id },
});
