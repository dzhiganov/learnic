import { gql } from '@apollo/client';

const updateWord = gql`
  mutation updateWord($uid: ID!, $wordId: ID!, $updatedFields: WordInput) {
    updateWord(uid: $uid, wordId: $wordId, updatedFields: $updatedFields) {
      uid
      __typename
    }
  }
`;

export default updateWord;
