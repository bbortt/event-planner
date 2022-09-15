import type { AppProps } from 'next/app';

import { UserProvider } from '@auth0/nextjs-auth0';

import '../styles/globals.scss';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { user } = pageProps;

  return (
    <UserProvider user={user}>
      <Component {...pageProps} />
    </UserProvider>
  );
};

export default MyApp;
