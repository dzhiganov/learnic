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
  const [currentWordId, setCurrentWordId] = useState<string>('');
  const [variants, setVariants] = useState<Variants | never[]>([]);
  const [restWords, setRestWords] = useState<Words>([]);

  const setTrainWord = useCallback(
    (arr) => {
      const random = getRandomWord(arr || []);
      const { id: randomId, translate: randomTranslate } = random;
      setCurrentWordId(randomId);

      const prepared = [...arr];

      const filtered = prepared.filter(({ id }) => id !== randomId);
      const randomVariants = getVariants(words as Words, 'translate', random);
      const shuffled = shuffle([
        ...randomVariants,
        randomTranslate,
      ]) as Variants;
      setVariants(shuffled);

      setRestWords(filtered);
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
      if (variant === words.find(({ id }) => id === currentWordId)?.translate) {
        setSuccesed(currentWordId);
      } else {
        setFailed(currentWordId);
      }
      checkRestWords();
    },
    [currentWordId, checkRestWords, setFailed, setSuccesed, words]
  );

  useEffect(() => {
    if (words) {
      setTrainWord(words);
    }
  }, [words, setTrainWord]);

  return (
    <>
      <Picker
        currentWord={words.find(({ id }) => id === currentWordId)?.word}
        variants={[...variants] as Variants}
        pick={pick}
        wordsCount={[restWords.length, words.length]}
      />
      <BackButton onBack={onBack} />
    </>
  );
};

export default memo(WordsTraining);
