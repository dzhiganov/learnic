import { gql } from 'graphql.macro';

const getUserTags = gql`
  query getUserTags($uid: ID!) {
    user(uid: $uid) {
      uid
      tags {
        id
        name
        color
      }
    }
  }
`;

export default getUserTags;
