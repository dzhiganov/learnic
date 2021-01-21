import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
import { getDefinition } from 'core/store/api/dictionary';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import shuffle from 'lodash.shuffle';
import Picker from '../Picker';
import getExamples from '../utils/prepareExamples';
import type { Variants, TrainingProps, Words } from '..';
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
  const [variants, setVariants] = useState<Variants | never[]>([]);
  const [restWords, setRestWords] = useState<Words>([]);
  const [sentences, setSentences] = useState<Sentences>([]);
  const [allWordsCount, setAllWordsCount] = useState<number>(0);
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
    (arr) => {
      const random = getRandomWord(arr || []);
      const { id: randomId, word: randomWord } = random;
      setCurrentWordId(randomId);

      const prepared = [...arr];

      const deletedIndex = prepared.findIndex(
        ({ word }) => word === randomWord
      );

      prepared.splice(deletedIndex, 1);

      const randomVariants = getVariants(words as Words, 'word', random);
      const shuffled = shuffle([...randomVariants, randomWord]) as Variants;
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
      if (variant === words.find(({ id }) => id === currentWordId)?.word) {
        setSuccesed(currentWordId);
      } else {
        setFailed(currentWordId);
      }
      checkRestWords();
    },
    [checkRestWords, setFailed, setSuccesed, currentWordId, words]
  );

  const fetchData = useCallback(async () => {
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

  const currentSentence = useMemo(() => {
    if (sentences.length) {
      const current = sentences.find(
        ({ word }) =>
          word === words.find(({ id }) => id === currentWordId)?.word
      );
      if (!current || !current.example) {
        return '';
      }
      const replacer = Array(4).fill('_').join('');
      const replaced = current.example.replaceAll(
        words.find(({ id }) => id === currentWordId)?.word,
        replacer
      );
      return replaced;
    }
    return '';
  }, [sentences, currentWordId, words]);

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
