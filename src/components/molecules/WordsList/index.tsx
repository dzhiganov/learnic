import React, { memo, useCallback, useState, useEffect } from 'react';
import firebase from 'firebase';
import Fuse from 'fuse.js';
import styles from './styles.module.css';
import Skeleton from '../../atoms/Skeleton';
import NewWord from './NewWord';
import Search from './Search';
import NoWord from './NoWord';
import If from '../../atoms/If';

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
  const [filter, setFilter] = useState<string>('');
  const [filtered, setFiltered] = useState<
    { word: string; translate: string }[]
  >([]);
  const handleKeyDown = useCallback(
    (event, { word, translate }) => {
      if (event.key === 'Enter') {
        onClickCard({ word, translate });
      }
    },
    [onClickCard]
  );

  useEffect(() => {
    if (filter) {
      const options = {
        threshold: 0.1,
        keys: ['word', 'translate'],
      };

      const fuse = new Fuse(words, options);
      const result = fuse.search(filter);
      const mapped = result.map(({ item }) => item);
      setFiltered(mapped);
    }
  }, [filter, words]);

  const handleChangeFilter = useCallback(({ target: { value = '' } = {} }) => {
    setFilter(value);
  }, []);

  const clearFilter = useCallback(() => setFilter(''), []);

  return (
    <>
      <div className={styles.buttonsContainer}>
        <Search value={filter} onChange={handleChangeFilter} />
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
            <If condition={showNewWord}>
              <li>
                <NewWord onSave={onSave} />
              </li>
            </If>
            {(filter && filtered.length > 0) || !filter ? (
              (filter ? filtered : words).map(({ word, translate }) => {
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
              })
            ) : (
              <NoWord word={filter} onSave={onSave} clearFilter={clearFilter} />
            )}
          </ul>
        )}
      </div>
    </>
  );
};

export default memo(WordsList);
