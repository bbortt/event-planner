import { gql } from '@apollo/client';

export const CreateLocalityMutation = gql`
  mutation CreateLocalityMutation($projectId: ID!, $locality: LocalityCreateInput!) {
    createLocality(projectId: $projectId, locality: $locality) {
      id
      name
      parent {
        id
      }
      project {
        id
      }
    }
  }
`;
