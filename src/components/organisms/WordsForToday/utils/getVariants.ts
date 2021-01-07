import getUniqNumbers from './getUniqNumbers';

type Words = {
  word: string;
  translate: string;
}[];

const anotherVariantsCount = 3;

interface GetVariants {
  (words: Words, currentTranslate: string): [string, string, string];
}

type Result = [string, string, string];

const getVariants: GetVariants = (words, currentTranslate) => {
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
  const deletedIndex = copy.findIndex(
    ({ translate }) => translate === currentTranslate
  );
  copy.splice(deletedIndex, 1);

  const indexes = getUniqNumbers(copy);

  return indexes.map((index) => {
    const { translate: randomTranslate = '' } = copy[index];
    return randomTranslate;
  }) as Result;
};

export { anotherVariantsCount };
export default getVariants;
