// @flow
import * as React from 'react';

import { Auth0Provider } from '@auth0/auth0-react';

export type auth0ProviderWrapperPropTypes = {
  children?: React.ChildrenArray<React.Element<any>>,
};

export const Auth0ProviderWrapper = ({ children }: auth0ProviderWrapperPropTypes): React.Element<typeof Auth0Provider> => {
  return (
    <Auth0Provider
      audience="http://localhost:8080"
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      redirectUri={window.location.origin}
      scope="restapi:access"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWrapper;
