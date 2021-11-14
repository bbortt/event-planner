import { gql } from '@apollo/client';

export const MemberApproveMutation = gql`
  mutation MemberApproveMutation($id: bigint, $changes: member_set_input!) {
    update_member(where: { id: { _eq: $id } }, _set: $changes) {
      affected_rows
      returning {
        id
        project {
          name
        }
        user {
          nickname
        }
      }
    }
  }
`;
