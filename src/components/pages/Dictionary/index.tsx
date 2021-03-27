import React, { memo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useMedia from 'react-use/lib/useMedia';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import WordsCard from '~c/molecules/WordsCard';
import WordsList from '~c/molecules/WordsList';
import useSelector from '~hooks/useSelector';
import { fetchDeleteWord, fetchAddNewWord, fetchUpdate } from '~actions/words';
import { Words } from '~/core/store/models/words';

type SelectedWord = {
  id: string;
  word: string;
  translate: string;
};

const selectedWordInitialState = {
  id: '',
  word: '',
  translate: '',
};

interface HandleOnSave {
  (props: { id?: string; word: string; translate: string }): void;
}

interface HandleOnDelete {
  (id: string): void;
}

interface HandleOnEdit {
  (id: string): void;
}

interface HandleClickCard {
  (props: SelectedWord): void;
}

interface HandleCancelEdit {
  (): void;
}

const Dictionary: React.FC = () => {
  const { t } = useTranslation();
  const isWide = useMedia('(min-width: 576px)');
  const dispatch = useDispatch();
  const [selectedWord, setSelectedWord] = useState<SelectedWord>(
    selectedWordInitialState
  );
  const [showNewWord, setShowNewWord] = useState(false);
  const [edited, setEdited] = useState<string>('');
  const words = useSelector<Words>('words.all');
  const userId = useSelector<string>('user.uid');

  const handleShowNewWord = useCallback(() => {
    setShowNewWord(true);
  }, []);

  const handleOnSave: HandleOnSave = useCallback(
    ({ id, word, translate }) => {
      if (id) {
        dispatch(
          fetchUpdate({
            uid: userId,
            id,
            data: {
              word,
              translate,
            },
          })
        );
        setEdited('');
      } else {
        dispatch(fetchAddNewWord({ uid: userId, word, translate }));
        setShowNewWord(false);
      }
    },
    [userId, dispatch]
  );

  const handleOnDelete: HandleOnDelete = useCallback(
    (id) => {
      dispatch(fetchDeleteWord({ uid: userId, wordId: id }));
    },
    [userId, dispatch]
  );

  const handleOnEdit: HandleOnEdit = useCallback((id) => setEdited(id), []);

  const handleClickCard: HandleClickCard = useCallback(
    (data) => setSelectedWord(data),
    []
  );

  const handleCancelEdit: HandleCancelEdit = useCallback(
    () => setEdited(''),
    []
  );

  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {isWide || (!isWide && !selectedWord.id) ? (
          <div className={styles.wordsListContainer}>
            {isWide || (!isWide && !selectedWord.id) ? (
              <h2 className={styles.title}>{t('DICTIONARY.TITLE')}</h2>
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

        {isWide || (!isWide && selectedWord.id) ? (
          <div className={styles.wordsCardContainer}>
            <WordsCard
              id={selectedWord.id}
              word={selectedWord.word}
              translate={selectedWord.translate}
              onClose={() =>
                setSelectedWord({
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

export default memo(Dictionary);
