import React, { useEffect, useState } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import random from 'lodash.random';
import styles from './styles.module.css';
import type { User } from '../../../core/store/models/user';
import { firestore } from '../../../database';
import type { RootState } from '../../../core/store/rootReducer';

const WordsForToday: React.FunctionComponent = () => {
  const [currentWord, setCurrentWord] = useState('');
  const user = useSelector(({ user: userData }: RootState) => userData);
  const [{ value: words }, fetch] = useAsyncFn(
    async (currentUser: User): Promise<firebase.firestore.DocumentData[]> => {
      const uid = currentUser?.uid;
      if (!uid) {
        throw new Error('UID must not be null');
      }
      const result: firebase.firestore.DocumentData[] = [];
      const start = new Date();
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

  useEffect(() => {
    if (user) {
      fetch(user);
    }
  }, [fetch, user]);

  useEffect(() => {
    if (words) {
      const { word: randomWord } = words[random(0, words.length)];
      setCurrentWord(randomWord);
    }
  }, [words]);

  return <div className={styles.container}>{currentWord}</div>;
};

export default WordsForToday;
