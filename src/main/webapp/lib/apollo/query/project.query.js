import { gql } from '@apollo/client';

export const ListProjectsQuery = gql`
  query ListProjectsQuery($count: Int, $offset: Int) {
    listProjects(count: $count, offset: $offset) {
      id
      name
    }
  }
`;
