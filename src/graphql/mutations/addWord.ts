import { gql } from '@apollo/client';

const addWord = gql`
  mutation addWord($uid: ID!, $word: String!, $translate: String!) {
    addWord(uid: $uid, word: $word, translate: $translate) {
      uid
      newWord {
        id
        word
        translate
        date
        repeat
        step
        audio
        examples
        __typename
      }
      __typename
    }
  }
`;

export default addWord;
