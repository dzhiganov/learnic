import { gql } from '@apollo/client';

const deleteUserTag = gql`
  mutation deleteWord($uid: ID!, $tagId: ID!) {
    deleteUserTag(uid: $uid, tagId: $tagId)
  }
`;

export default deleteUserTag;
