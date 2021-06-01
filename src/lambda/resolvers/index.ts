import User from '../models/User';
import Words from '../models/Words';

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
  // TODO use default color scheme
  if (!uid) return 'light';

  const { colorScheme } = (await getUserOptions(uid)) || {};

  if (!colorScheme) {
    return 'light';
  }

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

const updateUserOptions = async (
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
};

const addWord = async (
  _: unknown,
  { uid, word, translate }: { uid: string; word: string; translate: string }
): Promise<ReturnType<typeof Words.addWord>> => {
  const result = await Words.addWord({ uid, word, translate });

  return result;
};

const updateWord = async (
  _: unknown,
  {
    uid,
    id,
    updatedFields,
  }: {
    uid: string;
    id: string;
    updatedFields: {
      word?: string | undefined;
      translate?: string | undefined;
      example?: string | undefined;
      repeat?: string | undefined;
      step?: number | undefined;
    };
  }
): Promise<ReturnType<typeof Words.updateWord>> => {
  return Words.updateWord({ uid, id, updatedFields });
};

const deleteWord = async (
  _: unknown,
  { uid, wordId }: { uid: string; wordId: string }
): Promise<string> => {
  await Words.deleteWord({ uid, wordId });
  return wordId;
};

const resolvers = {
  User: {
    userOptions: ({ uid }: Params): Params => ({ uid }),
    words: ({ uid }: Params): ReturnType<typeof Words.getWords> =>
      Words.getWords(uid),
    trainingWords: ({ uid }: Params): ReturnType<typeof Words.getWords> =>
      Words.getWords(uid, true),
  },
  Query: {
    user: (_: unknown, { uid }: { uid: string }): Params => ({ uid }),
  },
  UserOptions: {
    language: getUserLanguage,
    colorScheme: getUserColorScheme,
  },
  Mutation: {
    updateUserOptions,
    updateWord,
    deleteWord,
    addWord,
  },
};

export default resolvers;
