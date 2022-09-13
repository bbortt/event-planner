// @flow
import * as React from 'react';
import { useEffect } from 'react';

import dynamic from 'next/dynamic';

import { setDefaultLocale } from 'react-datepicker';
import de from 'date-fns/locale/de';

import Navbar from 'lib/layout/navbar';

import registerRevealOverlayObserver from 'lib/foundation/register-reveal-overlay-observer';

import './_app.scss';

const Auth0ProviderWrapper: typeof Auth0ProviderWrapper = dynamic(() => import('lib/wrapper/auth0-provider.wrapper'), { ssr: false });

setDefaultLocale(de);

export type appPropTypes = {
  Component: React.ComponentType<any>,
  pageProps: any,
};

export const App = ({ Component, pageProps }: appPropTypes): React.Element<typeof Auth0ProviderWrapper> => {
  useEffect(() => registerRevealOverlayObserver(), []);

  return (
    <Auth0ProviderWrapper>
      <Navbar />

      <div className="container">
        <Component {...pageProps} />
      </div>
    </Auth0ProviderWrapper>
  );
};

export default App;
