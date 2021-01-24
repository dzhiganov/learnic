import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
import { getDefinition } from 'core/store/api/dictionary';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import shuffle from 'lodash.shuffle';
import Picker from '../Picker';
import getExamples from '../utils/prepareExamples';
import type { Word, Variants, TrainingProps, Words } from '..';
import Loading from '../../../atoms/Loading';
import getVariants from '../utils/getVariants';
import getRandomWord from '../utils/getRandomWord';
import BackButton from '../BackButton';

type Sentence = {
  word: string;
  example: string;
};

type Sentences = Sentence[];

const SentecesTraining: React.FunctionComponent<TrainingProps> = ({
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
  const [sentences, setSentences] = useState<Sentences>([]);
  const [allWordsCount, setAllWordsCount] = useState<number>(0);

  const currentData = useMemo(
    (): Word | undefined => words.find(({ id }) => currentWordId === id),
    [currentWordId, words]
  );

  const [{ loading }, fetch] = useAsyncFn(
    async (keyword: string): Promise<Sentence> => {
      const data = await getDefinition(keyword);

      if (data && Array.isArray(data)) {
        const { examples: resExamples } = getExamples(data);
        const [example] = resExamples;

        return {
          word: keyword,
          example,
        };
      }

      return {
        word: keyword,
        example: '',
      };
    },
    [],
    { loading: true }
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
    // TODO Refactor
    const data = await Promise.all(words.map(({ word }) => fetch(word)));
    const filtered = data.filter(({ example }) => example);
    setSentences(filtered);
    const filteredRestWords = words.filter(
      ({ word: target }) =>
        filtered.findIndex(({ word }) => word === target) !== -1
    ) as Words;
    setRestWords(filteredRestWords);
    setAllWordsCount(filteredRestWords.length);
  }, [fetch, words]);

  useEffect(() => {
    if (words) {
      fetchData();
    }
  }, [fetchData, words]);

  useEffect(() => {
    if (!loading) {
      setTrainWord(words);
    }
  }, [loading, words, setTrainWord]);

  const currentSentence = useMemo((): string => {
    if (sentences.length) {
      const finded = sentences.find(({ word }) => word === currentData?.word);

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

  if (loading) {
    return <Loading />;
  }

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
