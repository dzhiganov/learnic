import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
  type UserOptions {
    language: String!
    colorScheme: String!
  }

  input UserOptionsInput {
    language: String
    colorScheme: String
  }

  type Query {
    userOptions(uid: ID!): UserOptions
  }

  type Response {
    ok: Boolean
    message: String
  }

  type Mutation {
    updateUserOptions(uid: ID!, userOptions: UserOptionsInput!): Response
  }
`;

export default typeDefs;
