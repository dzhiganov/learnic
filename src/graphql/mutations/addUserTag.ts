import { gql } from '@apollo/client';

const addUserTag = gql`
  mutation addUserTag($uid: ID!, $name: String!, $color: String!) {
    addUserTag(uid: $uid, name: $name, color: $color) {
      uid
      tag {
        id
        name
        color
        __typename
      }
    }
    __typename
  }
`;

export default addUserTag;
