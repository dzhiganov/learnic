import { gql } from 'graphql.macro';

const getDefaultTags = gql`
  query getDefaultTags {
    defaultTags {
      id
      name
      color
    }
  }
`;

export default getDefaultTags;
