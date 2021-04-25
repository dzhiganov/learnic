import User from '../models/User';

type Response = {
  ok: boolean;
  message: string;
};

const getUserOptions = async (uid: string) => {
  const userData = await User.getUser(uid);

  return userData;
};

const getUserLanguage = async ({ uid }: { uid: string }): Promise<string> => {
  const { language } = await getUserOptions(uid);

  return language;
};

const getUserColorScheme = async ({
  uid,
}: {
  uid: string;
}): Promise<string> => {
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
  Query: {
    userOptions: (_: unknown, { uid }: { uid: string }): { uid: string } => ({
      uid,
    }),
  },
  Mutation: {
    updateUserOptions: async (
      _: unknown,
      {
        uid,
        userOptions,
      }: {
        uid: string;
        userOptions: {
          language?: string;
          colorScheme?: string;
        };
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

      return {
        ok: true,
        message: 'Successfully updated',
      };
    },
  },
  UserOptions: {
    language: getUserLanguage,
    colorScheme: getUserColorScheme,
  },
};

export default resolvers;
