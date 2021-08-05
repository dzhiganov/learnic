import { gql } from 'graphql.macro';

const getUserLanguageQuery = gql`
  query getUserLanguage($uid: ID!) {
    user(uid: $uid) {
      uid
      userOptions {
        language
      }
    }
  }
`;

export default getUserLanguageQuery;
