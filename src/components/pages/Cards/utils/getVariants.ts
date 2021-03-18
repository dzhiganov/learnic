import getUniqNumbers from './getUniqNumbers';

type Word = {
  id: string;
  word: string;
  translate: string;
};

type Words = Word[];

const anotherVariantsCount = 3;

interface GetVariants {
  (words: Words, key: keyof Word, selected: Word): [string, string, string];
}

type Result = [string, string, string];

const getVariants: GetVariants = (words, key, selected) => {
  if (
    !Array.isArray(words) ||
    words.length < anotherVariantsCount ||
    words.filter(
      (word) => !Object.prototype.hasOwnProperty.call(word, 'translate')
    ).length !== 0
  ) {
    return Array(anotherVariantsCount).fill('') as Result;
  }

  const copy = words.length ? [...words] : [];
  const filtered = copy.filter(({ id }) => id !== selected.id);

  const indexes = getUniqNumbers(filtered);

  return indexes.map((index) => {
    const item = filtered[index];
    return item[key];
  }) as Result;
};

export { anotherVariantsCount };
export default getVariants;
