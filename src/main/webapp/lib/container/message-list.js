// @flow
import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { messageDelete } from '../redux/action/message.action';
import { messagesSelector } from '../redux/selector/message.selector';

import Callout from '../foundation/callout';

export const MessageList = (): React.Element<'div'> => {
  const messages = useSelector(messagesSelector);
  const dispatch = useDispatch();

  const closeMessage = (id: number) => dispatch(messageDelete(id));

  return (
    <div className="message-list">
      {messages.map(message => (
        <Callout key={message.id} type={message.type} fit={false}>
          <button type="button" className="close-button" onClick={() => closeMessage(message.id)} aria-label="Nachricht schliessen">
            <span aria-hidden="true">&times;</span>
          </button>
          {message.title && <h5>{message.title}</h5>}
          <p>{message.message}</p>
        </Callout>
      ))}
    </div>
  );
};

export default MessageList;
