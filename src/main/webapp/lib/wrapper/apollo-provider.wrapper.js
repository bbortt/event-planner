// @flow
import * as React from 'react';
import { useEffect } from 'react';

import { ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useApollo } from '../apollo/client';

import { useAuth0 } from '@auth0/auth0-react';
import { User } from '@auth0/auth0-spa-js';

const createAuthContext = async getAccessTokenSilently => {
  const token = await getAccessTokenSilently({
    audience: 'http://localhost:8080',
    scope: 'graphql:access',
  });

  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
};

export type apolloProviderWrapperPropTypes = {
  children: React.ChildrenArray<'div' | React.Element<any>>,
  initialApolloState: any,
};

export const ApolloProviderWrapper = ({
  children,
  initialApolloState,
}: apolloProviderWrapperPropTypes): React.Element<typeof ApolloProvider> => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0<typeof User>();
  const apolloClient = useApollo(initialApolloState);

  useEffect(() => {
    if (isAuthenticated) {
      const creteAuthLink = async () => {
        const authLink = await createAuthContext(getAccessTokenSilently);
        apolloClient.setLink(authLink.concat(apolloClient.link));
      };
      creteAuthLink().catch(console.error);
    }
  }, [apolloClient, getAccessTokenSilently, isAuthenticated, user]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
