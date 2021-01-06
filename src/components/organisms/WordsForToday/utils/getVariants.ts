/* eslint-disable no-prototype-builtins */
import times from 'lodash.times';
import random from 'lodash.random';
import firebase from 'firebase';

type Words = firebase.firestore.DocumentData[] & {
  word: string;
  translate: string;
};

const anotherVariantsCount = 3;

interface GetVariants {
  (words: Words): [string, string, string];
}

type Result = [string, string, string];

const getVariants: GetVariants = (words) => {
  if (
    !Array.isArray(words) ||
    words.length < anotherVariantsCount ||
    words.filter((word) => !word.hasOwnProperty('translate')).length !== 0
  ) {
    return Array(anotherVariantsCount).fill('') as Result;
  }
  const result: string[] = [];
  const copy = words.length ? [...words] : [];

  times(anotherVariantsCount, () => {
    const currentIndex = random(0, words.length - 1);
    const { translate: randomTranslate = '' } = words[currentIndex] || {};
    copy.splice(currentIndex, 1);
    result.push(randomTranslate);
  });

  return result as Result;
};

export { anotherVariantsCount };
export default getVariants;
