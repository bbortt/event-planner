import { gql } from '@apollo/client';

import { getApolloClient } from '../client';

const ListProjectsQuery = gql`
  query ListProjectsQuery($count: Int, $offset: Int) {
    listProjects(count: $count, offset: $offset) {
      id
      name
    }
  }
`;

export const listProjects = () => {
  getApolloClient().query();
};
