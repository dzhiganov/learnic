import React, { memo, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import firebase from 'firebase';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { firestore } from '../../../database';
import type { RootState } from '../../../core/store/rootReducer';
import type { User } from '../../../core/store/models/user';
import styles from './styles.module.css';
import WordsCard from '../../molecules/WordsCard';
import WordsList from '../../molecules/WordsList';

const Cards: React.FunctionComponent = () => {
  const [openedCard, setOpenedCard] = useState<{
    word: string;
    translate: string;
  }>({
    word: '',
    translate: '',
  });
  const [showNewWord, setShowNewWord] = useState(false);
  const [edited, setEdited] = useState<string>('');
  const user = useSelector(({ user: userData }: RootState) => userData);
  const [{ value: words = [], loading }, fetch] = useAsyncFn(
    async (
      currentUser: User
    ): Promise<
      firebase.firestore.DocumentData &
        { id: string; word: string; translate: string }[]
    > => {
      const uid = currentUser?.uid;
      if (!uid) {
        throw new Error('UID must not be null');
      }
      const result: firebase.firestore.DocumentData &
        {
          id: string;
          word: string;
          translate: string;
        }[] = [];
      const request = firestore
        .collection('users')
        .doc(uid)
        .collection('words');
      const snapshot = await request.get();

      if (snapshot.empty) {
        throw new Error('Snapshot is empty');
      }

      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...(doc.data() as firebase.firestore.DocumentData & {
            word: string;
            translate: string;
          }),
        });
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

  const handleOnDelete = useCallback(
    async (id: string) => {
      await firestore
        .collection('users')
        .doc(user.uid)
        .collection('words')
        .doc(id)
        .delete();

      await fetch(user);
    },
    [fetch, user]
  );

  const handleOnEdit = useCallback((id) => {
    setEdited(id);
    // setShowNewWord(true);
  }, []);

  const handleClickCard = useCallback(({ word, translate }) => {
    setOpenedCard({ word, translate });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEdited('');
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Words</h2>
      <div className={styles.listContainer}>
        <div>
          <WordsList
            words={words}
            onShowNewWord={handleShowNewWord}
            onSave={handleOnSave}
            onDelete={handleOnDelete}
            onEdit={handleOnEdit}
            onClickCard={handleClickCard}
            showNewWord={showNewWord}
            setShowNewWord={setShowNewWord}
            loading={loading}
            edited={edited}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        <div>
          <WordsCard word={openedCard.word} translate={openedCard.translate} />
        </div>
      </div>
    </div>
  );
};

export default memo(Cards);
