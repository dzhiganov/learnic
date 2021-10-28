import { gql } from 'graphql.macro';

const getTrainingWords = gql`
  query getTrainingWords($uid: ID!) {
    user(uid: $uid) {
      uid
      trainingWords {
        id
        word
        translate
        audio
        examples {
          id
          text
        }
        date
      }
    }
  }
`;

export default getTrainingWords;
