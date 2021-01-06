import random from 'lodash.random';
import type { Words } from '..';

const getRandomWord = (
  arr: Words
): {
  randomWord: string;
  randomTranslate: string;
} => {
  const currentIndex = random(0, arr.length - 1);
  const { word: randomWord, translate: randomTranslate } =
    arr[currentIndex] || {};

  return {
    randomWord,
    randomTranslate,
  };
};

export default getRandomWord;
