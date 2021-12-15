import React, { memo, useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';
import { useTranslation } from 'react-i18next';
import Skeleton from '@material-ui/lab/Skeleton';
import dayjs from 'dayjs';
import styles from './styles.module.css';
import Search from './Search';
import NoWord from './NoWord';
import ListItem from './ListItem';
import HeaderDate from './HeaderDate';
import { Words } from '~shared/types';

const sceletonWidths = [70, 60, 80, 70, 60, 60];

type Props = {
  filter: string;
  setFilter: (filter: string) => void;
  words: Words;
  onShowNewWord: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickCard: ({
    id,
    word,
    translate,
  }: {
    id: string;
    word: string;
    translate: string;
  }) => void;
  showNewWord: boolean;
  setShowNewWord: (state: boolean) => void;
  edited: string;
  onCancelEdit: () => void;
  isLoading?: boolean;
};

const WordsList: React.FunctionComponent<Props> = ({
  filter,
  setFilter,
  words,
  onShowNewWord,
  showNewWord,
  setShowNewWord,
  onClickCard,
  edited,
  onCancelEdit,
  isLoading = true,
}: Props) => {
  const { t } = useTranslation();
  const [focused, setFocused] = useState('');
  const [filtered, setFiltered] = useState<Words>([]);
  const [searchFocused, setSearchFocused] = useState(false);

  const onCancelAddNewWord = useCallback(() => {
    onCancelEdit();
    setShowNewWord(false);
  }, [onCancelEdit, setShowNewWord]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Escape' && (showNewWord || edited)) {
        onCancelAddNewWord();
      }
    },
    [edited, onCancelAddNewWord, showNewWord]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

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

  const handleChangeFilter = useCallback(
    ({ target: { value = '' } = {} }) => {
      setFilter(value);
    },
    [setFilter]
  );

  const handleOnFocus = () => {
    if (!searchFocused) setSearchFocused(true);
  };

  const handleOnBlur = () => {
    if (searchFocused) setSearchFocused(false);
  };

  if (isLoading) {
    return (
      <>
        {sceletonWidths.map((width) => (
          <Skeleton
            variant="rect"
            width={`${width}%`}
            height={30}
            style={{ marginBottom: '10px' }}
          />
        ))}
      </>
    );
  }

  return (
    <>
      <div className={styles.buttonsContainer}>
        <header className={styles.header}>
          <Search
            value={filter}
            onChange={handleChangeFilter}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
          {!searchFocused && (
            <h2 className={styles.headerTitle}>{t('DICTIONARY.TITLE')}</h2>
          )}
          <button
            type="button"
            disabled={showNewWord}
            className={`${styles.addNewWordButton} ${
              showNewWord ? styles.disable : ''
            }`}
            onClick={onShowNewWord}
          >
            {t('DICTIONARY.NEW_WORD_BUTTON')}
          </button>
        </header>
      </div>

      <div className={styles.cardsContainer}>
        <ul className={styles.cardsList} onMouseLeave={() => setFocused('')}>
          {(filter && filtered.length > 0) || !filter ? (
            (filter ? filtered : words).map(
              ({ id, word, translate, date }, i, arr) => {
                const shouldRenderHeaderDate =
                  i > 0 &&
                  dayjs(arr[i - 1].date as string).isSame(
                    dayjs(date as string),
                    'day'
                  );
                const isFocused = focused === id;
                return (
                  <React.Fragment key={id}>
                    {(!shouldRenderHeaderDate || i === 0) && (
                      <HeaderDate strDate={date as string} />
                    )}
                    <ListItem
                      id={id}
                      word={word}
                      translate={translate}
                      onClick={onClickCard}
                      setFocused={setFocused}
                      isFocused={isFocused}
                    />
                  </React.Fragment>
                );
              }
            )
          ) : (
            <NoWord />
          )}
        </ul>
      </div>
    </>
  );
};

export default memo(WordsList);
