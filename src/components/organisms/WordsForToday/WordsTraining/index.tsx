import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import shuffle from 'lodash.shuffle';
import Picker from '../Picker';
import type { Word, Words, Variants, TrainingProps } from '..';
import getVariants from '../utils/getVariants';
import getRandomWord from '../utils/getRandomWord';
import BackButton from '../BackButton';
import useSelector from '~hooks/useSelector';

const WordsTraining: React.FunctionComponent<TrainingProps> = ({
  setStarted,
  setFinished,
  setFailed,
  setSuccesed,
  words,
  onBack,
}: TrainingProps) => {
  const [currentWordId, setCurrentWordId] = useState<string>('');
  const [variants, setVariants] = useState<Variants | unknown[]>([]);
  const [restWords, setRestWords] = useState<Words>([]);
  const allWords: Words = useSelector('words.all');

  const currentData = useMemo(
    (): Word | undefined => words.find(({ id }) => currentWordId === id),
    [currentWordId, words]
  );

  const setTrainWord = useCallback(
    (arr: Words) => {
      const random = getRandomWord(arr || []);
      const { id: randomId, translate: randomTranslate } = random;
      setCurrentWordId(randomId);

      const filtered = arr.filter(({ id }) => id !== randomId);
      const randomVariants = getVariants(
        allWords as Words,
        'translate',
        random
      );
      const shuffled = shuffle([
        ...randomVariants,
        randomTranslate,
      ]) as Variants;
      setVariants(shuffled);

      setRestWords(filtered);
    },
    [allWords]
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
      const isRightAnswer = variant === currentData?.translate;
      if (isRightAnswer) {
        setSuccesed(currentWordId);
      } else {
        setFailed(currentWordId);
      }
      checkRestWords();
    },
    [currentData, checkRestWords, currentWordId, setFailed, setSuccesed]
  );

  useEffect(() => {
    if (words) {
      setTrainWord(words);
    }
  }, [words, setTrainWord]);

  return (
    <>
      <Picker
        currentWord={currentData?.word || ''}
        variants={[...variants] as Variants}
        pick={pick}
        wordsCount={[restWords.length, words.length]}
      />
      <BackButton onBack={onBack} />
    </>
  );
};

export default memo(WordsTraining);
