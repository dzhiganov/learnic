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
          __typename
        }
        tags {
          id
          name
          color
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export default getWords;
