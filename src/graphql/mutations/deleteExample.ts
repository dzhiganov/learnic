import { gql } from '@apollo/client';

const deleteExample = gql`
  mutation deleteExample($uid: ID!, $wordId: ID!, $id: ID!) {
    deleteExample(uid: $uid, wordId: $wordId, id: $id)
  }
`;

export default deleteExample;
