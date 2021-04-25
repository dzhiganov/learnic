import User from '../models/User';

type UserOptions = {
  language: string;
  colorScheme: string;
};

type Response = {
  uid: string;
  userOptions: UserOptions;
};

type Params = {
  uid: string;
};

const getUserOptions = async (uid: string): Promise<UserOptions> => {
  const { userOptions } = await User.getUser(uid);

  return userOptions;
};

const getUserLanguage = async ({ uid }: Params): Promise<string> => {
  const { language } = await getUserOptions(uid);

  return language;
};

const getUserColorScheme = async ({ uid }: Params): Promise<string> => {
  const { colorScheme } = await getUserOptions(uid);

  return colorScheme;
};

const updateUserLanguage = async ({
  uid,
  language,
}: {
  uid: string;
  language: string;
}): Promise<unknown> => {
  return User.updateUser(uid, { language });
};

const updateUserColorScheme = async ({
  uid,
  colorScheme,
}: {
  uid: string;
  colorScheme: string;
}): Promise<unknown> => {
  return User.updateUser(uid, { colorScheme });
};

const resolvers = {
  User: {
    userOptions: ({ uid }: Params): Params => ({ uid }),
  },
  Query: {
    user: (_: unknown, { uid }: { uid: string }): Params => ({ uid }),
  },
  UserOptions: {
    language: getUserLanguage,
    colorScheme: getUserColorScheme,
  },
  Mutation: {
    updateUserOptions: async (
      _: unknown,
      {
        uid,
        userOptions,
      }: {
        uid: string;
        userOptions: Partial<UserOptions>;
      }
    ): Promise<Response> => {
      if (userOptions.language) {
        await updateUserLanguage({ uid, language: userOptions.language });
      }
      if (userOptions.colorScheme) {
        await updateUserColorScheme({
          uid,
          colorScheme: userOptions.colorScheme,
        });
      }

      const newState = await getUserOptions(uid);

      return {
        uid,
        userOptions: newState,
      };
    },
  },
};

export default resolvers;
