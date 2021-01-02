import React, { useEffect, useState, useCallback } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import random from 'lodash.random';
import times from 'lodash.times';
import shuffle from 'lodash.shuffle';
import styles from './styles.module.css';
import type { User } from '../../../core/store/models/user';
import { firestore } from '../../../database';
import type { RootState } from '../../../core/store/rootReducer';

const WordsForToday: React.FunctionComponent = () => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [variants, setVariants] = useState<string[]>([]);
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

  const getVariants = useCallback((arr) => {
    const result: string[] = [];
    const copy = [...arr];
    times(3, () => {
      const currentIndex = random(0, arr.length);
      const { translate: randomTranslate } = arr[currentIndex] || {};
      copy.splice(currentIndex, 1);
      result.push(randomTranslate);
    });

    return result;
  }, []);

  useEffect(() => {
    if (user) {
      fetch(user);
    }
  }, [fetch, user]);

  useEffect(() => {
    if (words) {
      const currentIndex = random(0, words.length);
      const { word: randomWord, translate: randomTranslate } = words[
        currentIndex
      ];
      setCurrentWord(randomWord);
      const copy = [...words];
      copy.splice(currentIndex, 1);
      setVariants(shuffle([...getVariants(copy), randomTranslate]));
    }
  }, [words, getVariants]);

  return (
    <div className={styles.container}>
      <div>{currentWord}</div>
      <ul>
        {variants.map((variant) => (
          <li>
            <span>{variant}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordsForToday;
