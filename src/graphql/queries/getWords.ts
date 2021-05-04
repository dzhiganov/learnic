import { gql } from 'graphql.macro';

const getWords = gql`
  query getWords($uid: ID!) {
    user(uid: $uid) {
      uid
      words {
        id
        word
        translate
        date
        repeat
        step
        audio
        examples
      }
    }
  }
`;

export default getWords;
