import { gql } from 'graphql.macro';

const getUserLanguageQuery = gql`
  query getUserLanguage($uid: ID!) {
    userOptions(uid: $uid) {
      language
    }
  }
`;

export default getUserLanguageQuery;
