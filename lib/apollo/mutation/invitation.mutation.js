import { gql } from '@apollo/client';

export const AcceptInvitationMutation = gql`
  mutation AcceptInvitationMutation($token: bpchar, $changes: invitation_set_input!) {
    update_invitation(where: { token: { _eq: $token } }, _set: $changes) {
      affected_rows
      returning {
        id
        invited_to {
          name
        }
      }
    }
  }
`;
