import React, { useEffect, useState, useCallback } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import shuffle from 'lodash.shuffle';
import styles from './styles.module.css';
import type { User } from '../../../core/store/models/user';
import { firestore } from '../../../database';
import type { RootState } from '../../../core/store/rootReducer';
import Picker from './Picker';
import Results from './Results';
import getVariants from './utils/getVariants';
import getRandomWord from './utils/getRandomWord';

type Words = {
  word: string;
  translate: string;
}[];

type Variants = [string, string, string, string];

const WordsForToday: React.FunctionComponent = () => {
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [currentTranslate, setCurrentTranslate] = useState<string>('');
  const [variants, setVariants] = useState<Variants | never[]>([]);
  const [restWords, setRestWords] = useState<Words>([]);
  const [succesed, setSuccesed] = useState<Words>([]);
  const [failed, setFailed] = useState<Words>([]);

  const user = useSelector(({ user: userData }: RootState) => userData);

  const [{ value: words }, fetch] = useAsyncFn(
    async (currentUser: User): Promise<firebase.firestore.DocumentData[]> => {
      const uid = currentUser?.uid;
      if (!uid) {
        throw new Error('UID must not be null');
      }
      const result: firebase.firestore.DocumentData[] = [];
      const start = new Date('12-22-2020');
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);

      const end = new Date();
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);

      const request = firestore
        .collection('users')
        .doc(uid)
        .collection('words')
        .where('repeat', '>', start)
        .where('repeat', '<', end);
      const snapshot = await request.get();

      if (snapshot.empty) {
        throw new Error('Snapshot is empty');
      }

      snapshot.forEach((doc) => {
        result.push(doc.data());
      });

      return result;
    },
    [],
    { loading: true }
  );

  const setTrainWord = useCallback(() => {
    if (restWords.length) {
      const { randomWord, randomTranslate } = getRandomWord(restWords || []);
      setCurrentWord(randomWord);
      setCurrentTranslate(randomTranslate);

      const prepared = [...restWords];

      const deletedIndex = prepared.findIndex(
        ({ word }) => word === randomWord
      );

      prepared.splice(deletedIndex, 1);

      const randomVariants = getVariants(
        words as firebase.firestore.DocumentData[] & {
          word: string;
          translate: string;
        }
      );
      const shuffled = shuffle([
        ...randomVariants,
        randomTranslate,
      ]) as Variants;

      setVariants(shuffled);

      setRestWords(prepared);
      setStarted(true);
    } else {
      setFinished(true);
    }
  }, [words, restWords]);

  const handleStart = useCallback(() => setTrainWord(), [setTrainWord]);

  const pick = useCallback(
    (variant: string) => {
      const currentData = {
        word: currentWord,
        translate: currentTranslate,
      };
      if (variant === currentTranslate) {
        setSuccesed([...succesed, currentData]);
      } else {
        setFailed([...failed, currentData]);
      }
      setTrainWord();
    },
    [currentTranslate, setTrainWord, currentWord, failed, succesed]
  );

  useEffect(() => {
    if (user) {
      fetch(user);
    }
  }, [fetch, user]);

  useEffect(() => {
    if (words) {
      const prepared = words.map(({ word, translate }) => ({
        word,
        translate,
      }));
      setRestWords(prepared);
    }
  }, [words]);

  if (finished) {
    return (
      <>
        <h2 className={styles.title}>Words For Today</h2>
        <div className={styles.container}>
          <Results results={[succesed.length, failed.length]} />
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className={styles.title}>Words For Today</h2>
      <div className={styles.container}>
        {started ? (
          <Picker
            currentWord={currentWord}
            variants={variants as Variants}
            pick={pick}
            wordsCount={[restWords.length, (words as Words).length]}
          />
        ) : (
          <button
            type="button"
            className={styles.startButton}
            onClick={handleStart}
          >
            Start
          </button>
        )}
      </div>
    </>
  );
};

export type { Variants, Words };
export default WordsForToday;
