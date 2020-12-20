import React, { memo, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import firebase from 'firebase';
import { Transition } from 'react-transition-group';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { firestore } from '../../../database';
import type { RootState } from '../../../core/store/rootReducer';
import type { User } from '../../../core/store/models/user';
import styles from './styles.module.css';
import NewWord from './NewWord';
import WordsCard from '../../molecules/WordsCard';
import Skeleton from '../../atoms/Skeleton';

const duration = 700;

const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  top: 0,
  right: '-848px',
  position: 'absolute',
  width: '800px',
  height: '100%',
};

const transitionStyles = {
  entering: { right: 0 },
  entered: { right: 0 },
  exiting: { right: '-848px' },
  exited: { right: '-848px' },
};

const Cards: React.FunctionComponent = () => {
  const [openedCard, setOpenedCard] = useState({
    word: '',
    translate: '',
  });
  const [showNewWord, setShowNewWord] = useState(false);
  const user = useSelector(({ user: userData }: RootState) => userData);
  const [{ value: words = [], loading }, fetch] = useAsyncFn(
    async (currentUser: User): Promise<firebase.firestore.DocumentData[]> => {
      const uid = currentUser?.uid;
      if (!uid) {
        throw new Error('UID must not be null');
      }
      const result: firebase.firestore.DocumentData[] = [];
      const request = firestore
        .collection('users')
        .doc(uid)
        .collection('words');
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
  }, [user, fetch]);

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
        .doc(user.uid)
        .collection('words');

      await request.add({
        word,
        translate,
        step: 0,
        date: new Date(),
      });

      await fetch(user);

      setShowNewWord(false);
    },
    [user, fetch]
  );

  const handleClickCard = useCallback(({ word, translate }) => {
    setOpenedCard({ word, translate });
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Words</h2>
      <div className={styles.cardsContainer}>
        {loading ? (
          <ul className={styles.cardsList}>
            <Skeleton variant="text" width={512} height={40} repeat={6} />
          </ul>
        ) : (
          <ul className={styles.cardsList}>
            {words.map(({ word, translate }) => {
              const onClick = () => handleClickCard({ word, translate });
              return (
                <li key={word}>
                  <button
                    className={styles.cardButton}
                    type="button"
                    onClick={onClick}
                  >{`${word} - ${translate}`}</button>
                </li>
              );
            })}
            {showNewWord ? (
              <li>
                <NewWord onSave={handleOnSave} />
              </li>
            ) : null}
          </ul>
        )}
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
      <Transition in={!!openedCard.word} timeout={duration}>
        {<T extends keyof typeof transitionStyles>(state: T) => (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <WordsCard
              word={openedCard.word}
              translate={openedCard.translate}
            />
          </div>
        )}
      </Transition>
    </div>
  );
};

export default memo(Cards);
