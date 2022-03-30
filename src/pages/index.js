// @flow
import * as React from 'react';
import { useEffect } from 'react';

import { title } from 'next';
import { useRouter } from 'next/router';

import { useAuth0 } from '@auth0/auth0-react';

import { LOCAL_STORAGE_ROUTER_PATH } from 'lib/constants';

import LandingPage from 'lib/container/landing-page';
import ErrorCallout from 'lib/layout/message/error.callout';
import LoadingCallout from 'lib/layout/message/loading.callout';

const Index = (): React.Element<typeof LoadingCallout | typeof ErrorCallout | 'div'> => {
  const router = useRouter();
  const { error, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      const routerPath = localStorage.getItem(LOCAL_STORAGE_ROUTER_PATH);
      if (routerPath) {
        router.push(routerPath);
      } else {
        router.push('/projects');
      }
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <LoadingCallout />;
  }

  if (error) {
    return <ErrorCallout title="Fähler bim Ilogge:" message={error.message} retryable={true} />;
  }

  // Reset any previously saved state
  localStorage.removeItem(LOCAL_STORAGE_ROUTER_PATH);

  return (
    <div>
      <title>Event Planer</title>

      <LandingPage />
    </div>
  );
};

export default Index;
