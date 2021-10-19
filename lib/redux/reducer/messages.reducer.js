// @flow
import type { messageAction, messageAddAction, messageDeleteAction } from '../action/message.action';
import { messageAddType, messageDeleteType } from '../action/message.action';

import type { Message } from '../../model/message';

export type messagesState = Array<Message>;

export const messagesReducer = (state: messagesState = [], action: messageAction): messagesState => {
  switch (action.type) {
    case messageAddType:
      const { message } = ((action: any): messageAddAction).payload;
      return [...state, message];
    case messageDeleteType:
      const { id } = ((action: any): messageDeleteAction).payload;
      return state.filter(message => message.id !== id);
    default:
      return state;
  }
};
