import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
  type User {
    uid: ID!
    userOptions: UserOptions
    words: [Word]
    trainingWords: [Word]
    tags: [Tag]
  }

  type UserOptions {
    language: String!
    colorScheme: String!
    useSuggestedTranslate: Boolean!
  }

  type Tags {
    userTags: [Tag]
  }

  input UserOptionsInput {
    language: String
    colorScheme: String
    useSuggestedTranslate: Boolean
  }

  type Tag {
    id: ID!
    name: String
    color: String
  }

  input Example {
    id: ID!
    text: String
  }

  type ExampleOutput {
    id: ID!
    text: String
  }

  type Word {
    id: ID!
    word: String!
    translate: String!
    date: String
    repeat: String
    step: Int
    audio: String
    transcription: String
    examples: [ExampleOutput]
    tags: [Tag]
  }

  type Query {
    user(uid: ID!): User
    defaultTags: [Tag]
  }

  input WordInput {
    word: String
    translate: String
    date: String
    repeat: String
    step: Int
    audio: String
    example: String
    tags: [[String]]
  }

  type WordMutationResponse {
    uid: ID!
    updatedWord: Word!
  }

  type AddWordResponse {
    uid: ID!
    newWord: Word!
  }

  type AddUserTagResponse {
    uid: ID!
    tag: Tag!
  }

  input ExampleBody {
    text: String
  }

  type AddExampleResponse {
    wordId: ID!
    example: ExampleOutput!
  }

  type Mutation {
    updateUserOptions(uid: ID!, userOptions: UserOptionsInput!): User
    updateWord(
      uid: ID!
      id: ID!
      updatedFields: WordInput
    ): WordMutationResponse
    deleteWord(uid: ID!, wordId: ID!): ID
    addWord(uid: ID!, word: String!, translate: String!): AddWordResponse
    addUserTag(uid: ID!, name: String!, color: String!): AddUserTagResponse
    deleteUserTag(uid: ID!, tagId: ID!): ID
    addExample(uid: ID!, wordId: ID!, data: ExampleBody): AddExampleResponse
    updateExample(uid: ID!, wordId: ID!, data: Example): ExampleOutput
    deleteExample(uid: ID!, wordId: ID!, id: ID!): ID
  }
`;

export default typeDefs;
