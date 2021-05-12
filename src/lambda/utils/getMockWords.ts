const getMockWords = (...args: string[]): unknown[] => {
  return args.map((params: string, index: number) => {
    const [word, translate, date, repeat, step, examples, audio] = params.split(
      /\s{1,}\|\s{1,}/
    );
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
        examples: examples.split(', '),
        audio,
      }),
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
    examples: examples.split(', '),
    audio,
  };
};

const getArrayOfWord = (...args: string[]): unknown[] => {
  return args.map((params: string) => getWordObject(params));
};

export { getWordObject, getArrayOfWord };
export default getMockWords;
