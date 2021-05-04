import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
  type User {
    uid: ID!
    userOptions: UserOptions
    words: [Word]
    trainingWords: [Word]
  }

  type UserOptions {
    language: String!
    colorScheme: String!
  }

  input UserOptionsInput {
    language: String
    colorScheme: String
  }

  type Word {
    id: ID!
    word: String!
    translate: String!
    date: String
    repeat: String
    step: Int
    audio: String
    examples: [String]
  }

  type Query {
    user(uid: ID!): User
  }

  input WordInput {
    word: String!
    translate: String!
    date: String
    repeat: String
    step: Int
    audio: String
    example: String
  }

  type WordMutationResponse {
    uid: ID
  }

  type AddWordResponse {
    uid: ID!
    newWord: Word!
  }

  type Mutation {
    updateUserOptions(uid: ID!, userOptions: UserOptionsInput!): User
    updateWord(
      uid: ID!
      wordId: ID!
      updatedFields: WordInput
    ): WordMutationResponse
    deleteWord(uid: ID!, wordId: ID!): ID
    addWord(uid: ID!, word: String!, translate: String!): AddWordResponse
  }
`;

export default typeDefs;
