import { GraphQLString, GraphQLObjectType } from 'graphql';

const UserOptionsType = new GraphQLObjectType({
  name: 'User Options',
  description: 'User Options',
  fields: () => ({
    colorScheme: { type: GraphQLString },
    language: { type: GraphQLString },
  }),
});

export default UserOptionsType;
