// @flow
import * as React from 'react';

import { useAuth0 } from '@auth0/auth0-react';

import Callout from '../foundation/callout';

export const LandingPage = (): React.Element<'div'> => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="landing-page">
      <h1>Willkommä bim Event Planer!</h1>

      <Callout type="primary">
        <h5>Mit mir mänätschisch diner Events locker.</h5>
        <p>
          <a onClick={loginWithRedirect}>Log di i</a> u de chöimer direkt los leggä!
        </p>
      </Callout>
    </div>
  );
};

export default LandingPage;
