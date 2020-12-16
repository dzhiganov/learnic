export const getExamples = (
  data: Array<{
    meanings: Array<
      Record<string, unknown> & {
        definitions: Array<{ example: string }>;
      }
    >;
    phonetics: Array<Record<string, unknown>>;
  }>
): { examples: string[]; audio: string } => {
  const [wordData] = data;
  const { meanings, phonetics: phoneticsList } = wordData;
  const [phonetics] = phoneticsList;
  const { audio } = phonetics;

  const result = meanings.reduce(
    (
      acc: string[],
      item: Record<string, unknown> & {
        definitions: Array<{ example: string }>;
      }
    ) => {
      const { definitions } = item;
      definitions.forEach(({ example }) => acc.push(example));
      return acc;
    },
    []
  );

  return {
    examples: result,
    audio: audio as string,
  };
};
