import { gql } from '@apollo/client';

export const ProjectInsertMutation = gql`
  mutation ProjectInsertMutation($project: project_insert_input!) {
    insert_project_one(object: $project) {
      id
      name
      members {
        id
      }
    }
  }
`;
