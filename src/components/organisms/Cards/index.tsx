import React, { memo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useMedia from 'react-use/lib/useMedia';
import styles from './styles.module.css';
import WordsCard from '~c/molecules/WordsCard';
import WordsList from '~c/molecules/WordsList';
import useSelector from '~hooks/useSelector';
import { fetchDeleteWord, fetchAddNewWord } from '~actions/words';

const Cards: React.FunctionComponent = () => {
  const isWide = useMedia('(min-width: 576px)');
  const dispatch = useDispatch();
  const [openedCard, setOpenedCard] = useState<{
    id: string;
    word: string;
    translate: string;
  }>({
    id: '',
    word: '',
    translate: '',
  });
  const [showNewWord, setShowNewWord] = useState(false);
  const [edited, setEdited] = useState<string>('');
  const words = useSelector('words.all');
  const userId = useSelector('user.uid');

  const handleShowNewWord = useCallback(() => {
    setShowNewWord(true);
  }, []);

  const handleOnSave = useCallback(
    ({ word, translate }: { word: string; translate: string }) => {
      dispatch(fetchAddNewWord({ uid: userId, word, translate }));

      setShowNewWord(false);
    },
    [userId, dispatch]
  );

  const handleOnDelete = useCallback(
    async (id: string) => {
      dispatch(fetchDeleteWord({ uid: userId, wordId: id }));
    },
    [userId, dispatch]
  );

  const handleOnEdit = useCallback((id) => {
    setEdited(id);
    // setShowNewWord(true);
  }, []);

  const handleClickCard = useCallback(({ id, word, translate }) => {
    setOpenedCard({ id, word, translate });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEdited('');
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {isWide || (!isWide && !openedCard.id) ? (
          <div className={styles.wordsListContainer}>
            {isWide || (!isWide && !openedCard.id) ? (
              <h2 className={styles.title}>My Words</h2>
            ) : null}
            <WordsList
              words={words}
              onShowNewWord={handleShowNewWord}
              onSave={handleOnSave}
              onDelete={handleOnDelete}
              onEdit={handleOnEdit}
              onClickCard={handleClickCard}
              showNewWord={showNewWord}
              setShowNewWord={setShowNewWord}
              edited={edited}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        ) : null}

        {isWide || (!isWide && openedCard.id) ? (
          <div className={styles.wordsCardContainer}>
            <WordsCard
              id={openedCard.id}
              word={openedCard.word}
              translate={openedCard.translate}
              onClose={() =>
                setOpenedCard({
                  id: '',
                  word: '',
                  translate: '',
                })
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default memo(Cards);
