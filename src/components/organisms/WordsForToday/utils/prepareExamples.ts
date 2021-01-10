type Definitions = { example: string }[];

type Meaning = Record<string, unknown> & {
  definitions: Definitions;
};

type Meanings = Meaning[];

type Phonetics = Record<string, unknown>[];

type Data = Array<{
  meanings: Meanings;
  phonetics: Phonetics;
}>;

type Prepared = { examples: string[]; audio: string };

const prepareExamples = (data: Data = []): Prepared => {
  const [wordData] = data;
  const { meanings, phonetics: phoneticsList } = wordData;
  const [phonetics] = phoneticsList;
  const { audio } = phonetics;

  const result = meanings.reduce((acc: string[], item: Meaning) => {
    const { definitions } = item;
    definitions.forEach(({ example }) => acc.push(example));
    return acc;
  }, []);

  return {
    examples: result,
    audio: audio as string,
  };
};

export default prepareExamples;
