import type { AppProps } from 'next/app';

import { UserProvider } from '@auth0/nextjs-auth0';

import { SSRProvider } from 'react-bootstrap';

import '../styles/globals.scss';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { user } = pageProps;

  return (
    <SSRProvider>
      <UserProvider user={user}>
        <Component {...pageProps} />
      </UserProvider>
    </SSRProvider>
  );
};

export default MyApp;
