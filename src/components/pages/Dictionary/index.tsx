import React, { memo, useState, useCallback, useRef } from 'react';
import produce from 'immer';
import useMedia from 'react-use/lib/useMedia';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import {
  useSpring,
  useChain,
  config,
  animated,
  useSpringRef,
} from '@react-spring/web';
import CloseIcon from '@material-ui/icons/Close';
import useClickAway from 'react-use/lib/useClickAway';
import Modal from '@material-ui/core/Modal';
import styles from './styles.module.css';
import WordsCard from '~c/molecules/WordsCard';
import WordsList from '~c/molecules/WordsList';
import useSelector from '~hooks/useSelector';
import getWordsQuery from '~graphql/queries/getWords';
import addWordMutation from '~graphql/mutations/addWord';
import updateWordMutation from '~graphql/mutations/updateWord';
import deleteWordMutation from '~graphql/mutations/deleteWord';
import { GetWordsQueryResult } from '~shared/types';
import NewWord from '~c/molecules/NewWord';

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
  const [open, setOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<SelectedWord>(
    selectedWordInitialState
  );

  const wordCardContainerRef = useRef(null);
  useClickAway(wordCardContainerRef, () => {
    setOpen(false);
  });

  const springApi = useSpringRef();
  const { width, ...rest } = useSpring({
    ref: springApi,
    config: config.default,
    from: { width: '0px' },
    to: {
      width: open ? '500px' : '0px',
    },
  });

  useChain(open ? [springApi] : [springApi], [0, open ? 0.1 : 0.6]);

  const [showNewWord, setShowNewWord] = useState(false);
  const [edited, setEdited] = useState<string>('');
  const userId = useSelector<string>('user.uid');
  const {
    data: { user: { words = [] } = {} } = {},
  } = useQuery<GetWordsQueryResult>(getWordsQuery, {
    variables: {
      uid: userId,
    },
  });
  const [fetchUpdate] = useMutation(updateWordMutation);
  const [fetchAddNewWord] = useMutation(addWordMutation, {
    update(cache, result) {
      const listWordsQueryResult = cache.readQuery<GetWordsQueryResult>({
        query: getWordsQuery,
        variables: {
          uid: userId,
        },
      });

      const newListWordsQueryResult = produce(
        listWordsQueryResult,
        (draft: typeof listWordsQueryResult) => {
          draft?.user.words.push(result?.data?.addWord?.newWord);
        }
      );

      cache.writeQuery({
        query: getWordsQuery,
        data: {
          user: {
            uid: userId,
            words: newListWordsQueryResult,
            __typename: 'User',
          },
        },
      });
    },
  });

  const [fetchDeleteWord] = useMutation(deleteWordMutation, {
    update(cache, result) {
      const id = result?.data?.deleteWord;

      cache.evict({
        id: cache.identify({
          __typename: 'Word',
          id,
        }),
      });
    },
  });

  const handleShowNewWord = useCallback(() => {
    setShowNewWord(true);
  }, []);

  const handleOnSave: HandleOnSave = useCallback(
    ({ id, word, translate }) => {
      if (id) {
        fetchUpdate({
          variables: {
            uid: userId,
            id,
            updatedFields: {
              word,
              translate,
            },
          },
        });
        setEdited('');
      } else {
        fetchAddNewWord({
          variables: { uid: userId, word, translate },
        });

        setShowNewWord(false);
      }
    },
    [userId, fetchUpdate, fetchAddNewWord]
  );

  const handleOnDelete: HandleOnDelete = useCallback(
    (id) => {
      fetchDeleteWord({ variables: { uid: userId, wordId: id } });
    },
    [userId, fetchDeleteWord]
  );

  const handleOnEdit: HandleOnEdit = useCallback((id) => setEdited(id), []);

  const handleClickCard: HandleClickCard = useCallback((data) => {
    setOpen(true);
    setSelectedWord(data);
  }, []);

  const handleCancelEdit: HandleCancelEdit = useCallback(() => {
    setShowNewWord(false);
    setEdited('');
  }, []);

  const renderModalBody = (
    type: 'new' | 'edit' = 'new'
  ): React.ReactElement => {
    return (
      <div className={styles.modalContainer}>
        <NewWord
          id={type === 'edit' ? edited : ''}
          onSave={handleOnSave}
          onCancel={handleCancelEdit}
          initialState={
            type === 'edit'
              ? {
                  word: words.find(({ id }) => id === edited)?.word || '',
                  translate:
                    words.find(({ id }) => id === edited)?.translate || '',
                }
              : null
          }
        />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Modal
        open={showNewWord || Boolean(edited)}
        onClose={handleCancelEdit}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {renderModalBody(edited ? 'edit' : 'new')}
      </Modal>
      {open && <div className={styles.mask} />}
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
          <animated.div
            className={styles.animatedContainer}
            style={{ ...rest, width }}
            ref={wordCardContainerRef}
          >
            <div className={styles.wordsCardContainer}>
              <button
                type="button"
                className={styles.closePopupButton}
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </button>
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
          </animated.div>
        ) : null}
      </div>
    </div>
  );
};

export default memo(Dictionary);
