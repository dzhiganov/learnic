import { gql } from '@apollo/client';

const updateUserOptions = gql`
  mutation updateUserOptions($uid: ID!, $userOptions: UserOptionsInput!) {
    updateUserOptions(uid: $uid, userOptions: $userOptions) {
      uid
      userOptions {
        colorScheme
        __typename
      }
      __typename
    }
  }
`;

export default updateUserOptions;
