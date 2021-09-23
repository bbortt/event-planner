import { gql } from '@apollo/client';

export const ProjectQuery = gql`
  query ProjectQuery {
    project {
      id
      name
    }
  }
`;
