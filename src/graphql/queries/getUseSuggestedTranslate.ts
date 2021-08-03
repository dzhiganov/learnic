import { gql } from 'graphql.macro';

const getUseSuggestedTranslateQuery = gql`
  query getUserColorScheme($uid: ID!) {
    user(uid: $uid) {
      uid
      userOptions {
        useSuggestedTranslate
      }
    }
  }
`;

export default getUseSuggestedTranslateQuery;
