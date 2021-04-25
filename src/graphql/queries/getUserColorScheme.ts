import { gql } from 'graphql.macro';

const getUserColorSchemeQuery = gql`
  query getUserColorScheme($uid: ID!) {
    userOptions(uid: $uid) {
      colorScheme
    }
  }
`;

export default getUserColorSchemeQuery;
