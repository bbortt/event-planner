import { gql } from '@apollo/client';

export const InsertProjectMutation = gql`
  mutation InsertProjectMutation($project: project_insert_input!) {
    insert_project_one(object: $project) {
      id
      name
      invitations {
        id
        token
      }
    }
  }
`;
