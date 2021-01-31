import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
import shuffle from 'lodash.shuffle';
import lRandom from 'lodash.random';
import Picker from '../Picker';
import type { Word, Variants, TrainingProps, Words } from '..';
import getVariants from '../utils/getVariants';
import getRandomWord from '../utils/getRandomWord';
import BackButton from '../BackButton';
import useSelector from '~hooks/useSelector';

type Sentence = {
  id: string;
  example: string;
};

type Sentences = Sentence[];

const SentecesTraining: React.FunctionComponent<TrainingProps> = ({
  setStarted,
  setFinished,
  setFailed,
  setSuccesed,
  onBack,
}: TrainingProps) => {
  const words: Words = useSelector('words.training');
  const [currentWordId, setCurrentWordId] = useState<string>('');
  const [variants, setVariants] = useState<Variants | unknown[]>([]);
  const [restWords, setRestWords] = useState<Words>([]);
  const [sentences, setSentences] = useState<Sentences>([]);
  const [allWordsCount, setAllWordsCount] = useState<number>(0);

  const currentData = useMemo(
    (): Word | undefined => words.find(({ id }) => currentWordId === id),
    [currentWordId, words]
  );

  const setTrainWord = useCallback(
    (arr: Words) => {
      const random = getRandomWord(arr || []);
      const { id: randomId, word: randomWord } = random;
      setCurrentWordId(randomId);

      const filtered = arr.filter(({ id }) => id !== randomId) as Words;

      const randomVariants = getVariants(words, 'word', random);
      const shuffled = shuffle([...randomVariants, randomWord]) as Variants;
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
      const isRightAnswer = variant === currentData?.word;

      if (isRightAnswer) {
        setSuccesed(currentWordId);
      } else {
        setFailed(currentWordId);
      }

      checkRestWords();
    },
    [checkRestWords, setFailed, setSuccesed, currentWordId, currentData]
  );

  const fetchData = useCallback(async () => {
    const data = words.map(({ id, examples }) => {
      const currentExample = examples[lRandom(0, examples.length - 1)];
      return {
        id,
        example: currentExample,
      };
    });
    setSentences(data);
    const filteredRestWords = words.filter(
      ({ id: targetId }) => data.findIndex(({ id }) => id === targetId) !== -1
    ) as Words;
    setRestWords(filteredRestWords);
    setAllWordsCount(filteredRestWords.length);
  }, [words]);

  useEffect(() => {
    if (words) {
      fetchData();
    }
  }, [fetchData, words]);

  useEffect(() => {
    setTrainWord(words);
  }, [words, setTrainWord]);

  const currentSentence = useMemo((): string => {
    if (sentences.length) {
      const finded = sentences.find(({ id }) => id === currentData?.id);

      if (!finded || !finded.example) {
        return '';
      }

      const replacer = Array(4).fill('_').join('');
      const replaced = finded.example.replaceAll(
        currentData?.word as string,
        replacer
      );
      return replaced;
    }
    return '';
  }, [currentData, sentences]);

  return (
    <>
      <Picker
        currentWord={currentSentence}
        variants={[...variants] as Variants}
        pick={pick}
        wordsCount={[restWords.length, allWordsCount]}
      />
      <BackButton onBack={onBack} />
    </>
  );
};

export default memo(SentecesTraining);
