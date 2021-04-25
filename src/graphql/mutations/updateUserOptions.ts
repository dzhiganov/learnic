import { gql } from '@apollo/client';

const updateUserOptions = gql`
  mutation updateUserOptions($uid: ID!, $userOptions: UserOptionsInput!) {
    updateUserOptions(uid: $uid, userOptions: $userOptions) {
      ok
      message
    }
  }
`;

export default updateUserOptions;
