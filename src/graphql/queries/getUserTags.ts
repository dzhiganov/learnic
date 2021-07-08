import { gql } from 'graphql.macro';

const getUserTags = gql`
  query getUserTags($uid: ID!) {
    user(uid: $uid) {
      uid
      tags {
        name
        color
      }
    }
  }
`;

export default getUserTags;
