import React, { memo, useEffect, useState, useCallback } from 'react';
import shuffle from 'lodash.shuffle';
import Picker from '../Picker';
import type { Words, Variants, TrainingProps } from '..';
import getVariants from '../utils/getVariants';
import getRandomWord from '../utils/getRandomWord';
import BackButton from '../BackButton';

const WordsTraining: React.FunctionComponent<TrainingProps> = ({
  setStarted,
  setFinished,
  setFailed,
  setSuccesed,
  words,
  onBack,
}: TrainingProps) => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [currentTranslate, setCurrentTranslate] = useState<string>('');
  const [variants, setVariants] = useState<Variants | never[]>([]);
  const [restWords, setRestWords] = useState<Words>([]);

  const setTrainWord = useCallback(
    (arr) => {
      const random = getRandomWord(arr || []);
      const { word: randomWord, translate: randomTranslate } = random;
      setCurrentWord(randomWord);
      setCurrentTranslate(randomTranslate);

      const prepared = [...arr];

      const deletedIndex = prepared.findIndex(
        ({ word }) => word === randomWord
      );

      prepared.splice(deletedIndex, 1);

      const randomVariants = getVariants(words as Words, 'translate', random);
      const shuffled = shuffle([
        ...randomVariants,
        randomTranslate,
      ]) as Variants;
      setVariants(shuffled);

      setRestWords(prepared);
    },
    [words]
  );

  const checkRestWords = useCallback(() => {
    if (restWords.length) {
      setTrainWord(restWords);
      setStarted(true);
    } else {
      setFinished(true);
    }
  }, [restWords, setStarted, setFinished, setTrainWord]);

  const pick = useCallback(
    (variant: string) => {
      const currentData = {
        word: currentWord,
        translate: currentTranslate,
      };
      if (variant === currentWord) {
        setSuccesed(currentData);
      } else {
        setFailed(currentData);
      }
      checkRestWords();
    },
    [currentTranslate, currentWord, checkRestWords, setFailed, setSuccesed]
  );

  useEffect(() => {
    if (words) {
      setTrainWord(words);
    }
  }, [words, setTrainWord]);

  return (
    <>
      <Picker
        currentWord={currentWord}
        variants={[...variants] as Variants}
        pick={pick}
        wordsCount={[restWords.length, words.length]}
      />
      <BackButton onBack={onBack} />
    </>
  );
};

export default memo(WordsTraining);
