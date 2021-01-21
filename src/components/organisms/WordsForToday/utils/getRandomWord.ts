import random from 'lodash.random';
import type { Words } from '..';

const getRandomWord = (
  arr: Words
): {
  id: string;
  word: string;
  translate: string;
} => {
  const currentIndex = random(0, arr.length - 1);
  const { id, word, translate } = arr[currentIndex] || {};

  return {
    id,
    word,
    translate,
  };
};

export default getRandomWord;
