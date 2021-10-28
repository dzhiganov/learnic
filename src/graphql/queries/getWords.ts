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
        transcription
        examples {
          id
          text
        }
        tags {
          id
          name
          color
        }
      }
    }
  }
`;

export default getWords;
