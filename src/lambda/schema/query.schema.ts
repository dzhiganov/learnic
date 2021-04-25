import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
  type User {
    uid: ID!
    userOptions: UserOptions
  }

  type UserOptions {
    language: String!
    colorScheme: String!
  }

  input UserOptionsInput {
    language: String
    colorScheme: String
  }

  type Query {
    user(uid: ID!): User
  }

  type Mutation {
    updateUserOptions(uid: ID!, userOptions: UserOptionsInput!): User
  }
`;

export default typeDefs;
