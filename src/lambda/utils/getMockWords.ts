const getMockWords = (...args: string[]): unknown[] => {
  return args.map((params: string, index: number) => {
    const [
      word,
      translate,
      date,
      repeat,
      step,
      tags,
      examples,
      audio,
    ] = params.split(/\s{1,}\|\s{1,}/);
    return {
      data: () => ({
        id: index.toString(),
        word,
        translate,
        date: {
          toDate: () => ({
            toString: () => date,
          }),
        },
        repeat: {
          toDate: () => ({
            toString: () => repeat,
          }),
        },
        step: Number(step),
        tags: tags.split(', ').map((tag) => ({
          get: () => ({
            data: () => ({ id: 'fake id', name: tag, color: 'fake color' }),
          }),
        })),
        audio,
      }),
      ref: {
        collection: (collectionName: string) => {
          const collections = {
            examples: {
              get: () =>
                examples.split(', ').map((example) => {
                  return {
                    id: `${example}_id`,
                    data: () => ({
                      text: example,
                    }),
                  };
                }),
            },
          };

          return collections[collectionName as keyof typeof collections];
        },
      },
    };
  });
};

const getWordObject = (params: string): Record<string, unknown> => {
  const [
    id,
    word,
    translate,
    date,
    repeat,
    step,
    tags,
    examples,
    audio,
  ] = params.split(/\s{1,}\|\s{1,}/);
  return {
    id,
    word,
    translate,
    date,
    repeat,
    step: Number(step),
    tags: tags
      .split(', ')
      .map((tag) => ({ id: 'fake id', name: tag, color: 'fake color' })),
    audio,
    examples: examples.split(', ').map((example) => {
      return {
        id: `${example}_id`,
        text: example,
      };
    }),
  };
};

const getArrayOfWord = (...args: string[]): unknown[] => {
  return args.map((params: string) => getWordObject(params));
};

export { getWordObject, getArrayOfWord };
export default getMockWords;
