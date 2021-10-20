// @flow
import * as React from 'react';

import Callout from '../../foundation/callout';

export type errorCalloutPropTypes = {
  title: string,
  message: string,
  retryable?: boolean,
};

export const ErrorCallout = ({ title, message, retryable = false }: errorCalloutPropTypes): React.Element<typeof Callout> => {
  if (retryable) {
    return (
      <Callout type="alert">
        <strong>{title}</strong>
        <p>
          <i>{message}</i>
        </p>
        <p>Bitte versuechs imne Momänt nomal..</p>
      </Callout>
    );
  }

  return (
    <Callout type="alert">
      <strong>{title}</strong>
      <p>
        <i>{message}</i>
      </p>
    </Callout>
  );
};

export default ErrorCallout;
