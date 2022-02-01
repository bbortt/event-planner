import { gql } from '@apollo/client';

export const ListLocalitiesQuery = gql`
  query ListLocalitiesQuery($projectId: ID, $parentLocalityId: ID) {
    listLocalities(projectId: $projectId, parentLocalityId: $parentLocalityId) {
      id
      name
    }
  }
`;
