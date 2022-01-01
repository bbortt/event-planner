import { gql } from '@apollo/client';

export const CreateProjectMutation = gql`
  mutation CreateProjectMutation($project: ProjectCreateInput!) {
    createProject(project: $project) {
      id
      name
    }
  }
`;
