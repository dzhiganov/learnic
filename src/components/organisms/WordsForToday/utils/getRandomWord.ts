import random from 'lodash.random';
import type { Words } from '..';

const getRandomWord = (
  arr: Words
): {
  word: string;
  translate: string;
} => {
  const currentIndex = random(0, arr.length - 1);
  const { word, translate } = arr[currentIndex] || {};

  return {
    word,
    translate,
  };
};

export default getRandomWord;
