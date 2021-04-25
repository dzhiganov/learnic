import { gql } from 'graphql.macro';

const getUserColorSchemeQuery = gql`
  query getUserColorScheme($uid: ID!) {
    user(uid: $uid) {
      uid
      userOptions {
        colorScheme
      }
    }
  }
`;

export default getUserColorSchemeQuery;
