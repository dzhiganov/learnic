import React, { memo, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import firebase from 'firebase';
import { firestore } from '../../../database';
import type { RootState } from '../../../core/store/rootReducer';
import styles from './styles.module.css';
import NewWord from './NewWord';

const Cards: React.FunctionComponent = () => {
  const [showNewWord, setShowNewWord] = useState(false);
  const [words, setWords] = useState<firebase.firestore.DocumentData[]>([]);
  const user = useSelector((state: RootState) => state.user);

  const getWords = useCallback(async (): Promise<void> => {
    const uid = user?.user?.uid;
    if (!uid) {
      return;
    }
    const result: firebase.firestore.DocumentData[] = [];
    const request = firestore.collection('users').doc(uid).collection('words');
    const snapshot = await request.get();

    if (snapshot.empty) {
      // TODO Handle empty
      return;
    }

    snapshot.forEach((doc) => {
      result.push(doc.data());
    });

    setWords(result);
  }, [user]);

  useEffect(() => {
    if (user) {
      getWords();
    }
  }, [user, getWords]);

  const handleShowNewWord = useCallback(() => {
    setShowNewWord(true);
  }, []);

  const handleOnSave = useCallback(
    async ({
      word,
      translate,
    }: {
      word: string;
      translate: string;
    }): Promise<void> => {
      const request = firestore
        .collection('users')
        .doc(user?.user?.uid)
        .collection('words');

      await request.add({
        word,
        translate,
        step: 0,
        date: new Date(),
      });

      await getWords();

      setShowNewWord(false);
    },
    [user, getWords]
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Words</h2>
      <div className={styles.cardsContainer}>
        <ul className={styles.cardsList}>
          {words.map(({ word, translate }) => (
            <li key={word}>{`${word} - ${translate}`}</li>
          ))}
          {showNewWord ? (
            <li>
              <NewWord onSave={handleOnSave} />
            </li>
          ) : null}
        </ul>
      </div>
      <div className={styles.buttonsContainer}>
        <button
          type="button"
          className={styles.addNewWordButton}
          onClick={handleShowNewWord}
        >
          New Word
        </button>
      </div>
    </div>
  );
};

export default memo(Cards);
