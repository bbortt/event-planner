// @flow
import type { applicationState } from '../store';
import type { Message } from '../../model/message';

export const messagesSelector = (state: applicationState): Message[] => state.messages;
