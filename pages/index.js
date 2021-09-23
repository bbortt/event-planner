// @flow
import * as React from 'react';

import { title } from 'next';
import Router from 'next/router';

import { useAuth0 } from '@auth0/auth0-react';

import LandingPage from '../lib/container/landing-page';
import ErrorCallout from '../lib/layout/message/error.callout';
import LoadingCallout from '../lib/layout/message/loading.callout';

const Index = (): React.Element<typeof LoadingCallout | typeof ErrorCallout | 'div'> => {
  const { error, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingCallout />;
  }

  if (error) {
    return <ErrorCallout title="Fähler bim Ilogge:" message={error.message} retryable={true} />;
  }

  if (isAuthenticated) {
    Router.push('/projects');
  }

  return (
    <div>
      <title>Event Planer</title>

      <LandingPage />
    </div>
  );
};

export default Index;
