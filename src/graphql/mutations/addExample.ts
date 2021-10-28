import { gql } from '@apollo/client';

const addExample = gql`
  mutation addUserTag($uid: ID!, $wordId: ID!, $data: ExampleBody!) {
    addExample(uid: $uid, wordId: $wordId, data: $data) {
      wordId
      example {
        id
        text
        __typename
      }
    }
    __typename
  }
`;

export default addExample;
