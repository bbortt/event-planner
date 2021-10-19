// @flow
import * as React from 'react';

import Callout from '../../foundation/callout';

export const LoadingCallout = (): React.Element<typeof Callout> => {
  return (
    <Callout>
      <strong>Am Ladä..</strong>
      <p>Bitte häb hurti chli Geduld.</p>
    </Callout>
  );
};

export default LoadingCallout;
