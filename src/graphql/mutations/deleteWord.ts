import { gql } from '@apollo/client';

const deleteWord = gql`
  mutation deleteWord($uid: ID!, $wordId: ID!) {
    deleteWord(uid: $uid, wordId: $wordId)
  }
`;

export default deleteWord;
