// @flow
import { useMemo } from 'react';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';

import merge from 'deepmerge';

let apolloClient: typeof ApolloClient;

const createIsomorphLink = (): typeof HttpLink => {
  const { HttpLink } = require('@apollo/client/link/http');
  return new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'localhost:8080/api/graphql/v1',
  });
};

const createApolloClient = (): typeof ApolloClient =>
  new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  });

export const initializeApollo = (initialState: typeof InMemoryCache = null): typeof ApolloClient => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache);

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const getApolloClient = (): typeof ApolloClient => {
  if (!apolloClient) {
    throw new Error('Apollo has not yet been initialized!');
  }

  return apolloClient;
};

export const useApollo = (initialState: typeof InMemoryCache = null): typeof ApolloClient =>
  useMemo(() => initializeApollo(initialState), [initialState]);
