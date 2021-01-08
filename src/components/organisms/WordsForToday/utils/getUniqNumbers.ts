import times from 'lodash.times';
import random from 'lodash.random';
import isArrayUnique from './isArrayUnique';

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

  if (isArrayUnique(result)) {
    return result;
  }
  return getUniqNumbers(arr);
};

export default getUniqNumbers;
