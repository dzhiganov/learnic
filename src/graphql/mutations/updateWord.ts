import { gql } from '@apollo/client';

const updateWord = gql`
  mutation updateWord($uid: ID!, $id: ID!, $updatedFields: WordInput) {
    updateWord(uid: $uid, id: $id, updatedFields: $updatedFields) {
      uid
      updatedWord {
        id
        word
        translate
        date
        repeat
        step
        audio
        examples
        tags {
          id
          name
          color
        }
        __typename
      }
      __typename
    }
  }
`;

export default updateWord;
