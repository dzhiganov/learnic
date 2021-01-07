import times from 'lodash.times';
import random from 'lodash.random';

const anotherVariantsCount = 3;

type Words = {
  word: string;
  translate: string;
}[];

const getUniqNumbers = (arr: Words): number[] => {
  const result: number[] = [];
  times(anotherVariantsCount, () => {
    const currentIndex = random(0, arr.length - 1);
    result.push(currentIndex);
  });

  const { size: setSize } = new Set(result);

  if (result.length !== setSize) {
    return getUniqNumbers(arr);
  }
  return result;
};

export default getUniqNumbers;
