// @flow
import type { DocumentNode } from 'graphql';
import { getApolloClient } from './client';

const HASURA_ROLE = 'X-Hasura-Role';

export const hasuraQuery = async <T>(query: DocumentNode, role: string = 'user'): Promise<{ data?: T | null }> =>
  getApolloClient().query<T>({
    context: { headers: { [HASURA_ROLE]: role } },
    query,
  });

export const hasuraMutation = async <T>(
  mutation: DocumentNode,
  variables: Object = {},
  role: string = 'user'
): Promise<{ data?: T | null }> =>
  // ): ({ then: (resolve: ({ data: { data: MutationRoot }, loading: boolean }) => void) => void }) =>
  getApolloClient().mutate<T>({
    context: { headers: { [HASURA_ROLE]: role } },
    mutation,
    variables,
  });
