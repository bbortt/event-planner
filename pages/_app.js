// @flow
import * as React from 'react';
import { useEffect } from 'react';

import Auth0ProviderWrapper from '../lib/wrapper/auth0-provider.wrapper';
import ApolloProviderWrapper from '../lib/wrapper/apollo-provider.wrapper';
import ReduxWrapper from '../lib/wrapper/redux.wrapper';
import SafeHydrate from '../lib/wrapper/safe-hydrate';

import Navbar from '../lib/layout/navbar';

import registerRevealOverlayObserver from '../lib/foundation/register-reveal-overlay-observer';

import './_app.scss';

export type appPropTypes = {
  Component: React.ComponentType<any>,
  pageProps: any,
};

export const App = ({ Component, pageProps }: appPropTypes): React.Element<typeof SafeHydrate> => {
  const { initialApolloState } = pageProps;

  useEffect(() => registerRevealOverlayObserver(), []);

  return (
    <SafeHydrate>
      <Auth0ProviderWrapper>
        <ApolloProviderWrapper initialApolloState={initialApolloState}>
          <ReduxWrapper>
            <Navbar />

            <div className="container">
              <Component {...pageProps} />
            </div>
          </ReduxWrapper>
        </ApolloProviderWrapper>
      </Auth0ProviderWrapper>
    </SafeHydrate>
  );
};

export default App;
