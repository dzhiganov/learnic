import React, { memo, useCallback } from 'react';
import firebase from 'firebase';
import styles from './styles.module.css';
import Skeleton from '../../atoms/Skeleton';
import NewWord from './NewWord';

type Props = {
  words: firebase.firestore.DocumentData &
    {
      word: string;
      translate: string;
    }[];
  onShowNewWord: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSave: ({
    word,
    translate,
  }: {
    word: string;
    translate: string;
  }) => Promise<void>;
  onClickCard: ({
    word,
    translate,
  }: {
    word: string;
    translate: string;
  }) => void;
  showNewWord: boolean;
  loading: boolean;
};

const WordsList: React.FunctionComponent<Props> = ({
  words,
  onShowNewWord,
  showNewWord,
  onSave,
  onClickCard,
  loading,
}: Props) => {
  const handleKeyDown = useCallback(
    (event, { word, translate }) => {
      if (event.key === 'Enter') {
        onClickCard({ word, translate });
      }
    },
    [onClickCard]
  );

  return (
    <>
      <div className={styles.buttonsContainer}>
        <button
          type="button"
          className={styles.addNewWordButton}
          onClick={onShowNewWord}
        >
          New Word
        </button>
      </div>
      <div className={styles.cardsContainer}>
        {loading ? (
          <ul className={styles.cardsList}>
            <Skeleton variant="text" width={512} height={40} repeat={4} />
          </ul>
        ) : (
          <ul className={styles.cardsList}>
            {showNewWord ? (
              <li>
                <NewWord onSave={onSave} />
              </li>
            ) : null}
            {words.map(({ word, translate }) => {
              const onClick = () => onClickCard({ word, translate });
              return (
                <li key={word}>
                  <span
                    role="button"
                    className={styles.cardButton}
                    onClick={onClick}
                    tabIndex={0}
                    onKeyDown={(event) =>
                      handleKeyDown(event, { word, translate })
                    }
                  >{`${word} - ${translate}`}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default memo(WordsList);
