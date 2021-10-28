import { gql } from '@apollo/client';

const updateExample = gql`
  mutation updateExample($uid: ID!, $wordId: ID!, $data: Example!) {
    updateExample(uid: $uid, wordId: $wordId, data: $data) {
      id
      text
      __typename
    }
  }
`;

export default updateExample;
