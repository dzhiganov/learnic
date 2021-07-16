import React, { memo, useState, useCallback, useMemo } from 'react';
import useMedia from 'react-use/lib/useMedia';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/client';
import styles from './styles.module.css';
import AddExample from './AddExample';
import useSelector from '~hooks/useSelector';
import StepsPopup from './StepsPopup';
import AudioButton from '~c/atoms/AudioButton';
import updateWordMutation from '~graphql/mutations/updateWord';
import getWords from '~graphql/queries/getWords';
import { GetWordsQueryResult } from '~shared/types';

type Props = {
  id: string;
  word: string;
  translate: string;
  onClose: () => void;
};

const WordsCard: React.FunctionComponent<Props> = ({
  id,
  word,
  translate,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const isWide = useMedia('(min-width: 576px)');
  const [showAddExample, setShowAddExample] = useState<boolean>(false);
  const uid = useSelector<string>('user.uid');
  const [fetchUpdate] = useMutation(updateWordMutation);
  const {
    data: { user: { words = [] } = {} } = {},
  } = useQuery<GetWordsQueryResult>(getWords, {
    variables: {
      uid,
    },
  });

  const value = useMemo(() => {
    return words.find(({ id: wordId }) => wordId === id);
  }, [id, words]);

  const handleClickAddExample = useCallback(() => {
    setShowAddExample(true);
  }, []);

  const handleCancelAddWord = useCallback(() => {
    setShowAddExample(false);
  }, []);

  const onAddNewExample = useCallback(
    async (example) => {
      await fetchUpdate({
        variables: { uid, wordId: id, updatedFields: { example } },
      });
      setShowAddExample(false);
    },

    [id, uid, fetchUpdate]
  );

  const backToTheList = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!id) {
    return (
      <div className={styles.container}>
        <div className={styles.notSelectedContainer}>
          <span>🤔 Please select word</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {!isWide ? (
        <div className={styles.backButtonContainer}>
          <button
            type="button"
            className={styles.backButton}
            onClick={backToTheList}
          >
            <KeyboardBackspaceIcon />
          </button>
        </div>
      ) : null}
      <div className={styles.wordSection}>
        <div className={styles.wordContainer}>
          <span>{`${word} - ${translate}`}</span>
        </div>

        <div className={styles.buttons}>
          <AudioButton audioURL={value?.audio || ''} />

          <StepsPopup
            step={value?.step || 0}
            repeat={(value?.repeat as unknown) as Date}
          />
        </div>
      </div>
      <div className={styles.contextSection}>
        <div className={styles.examples}>
          <div className={styles.examplesTitle}>
            <span>{`${t('DICTIONARY.WORD_CARD.EXAMPLES_TITLE')}`}</span>
          </div>
          <button
            className={styles.addExampleButton}
            type="button"
            onClick={handleClickAddExample}
          >
            {`${t('DICTIONARY.WORD_CARD.ADD_EXAMPLE_BUTTON')}`}
          </button>
        </div>
        {showAddExample ? (
          <AddExample onSave={onAddNewExample} onCancel={handleCancelAddWord} />
        ) : null}
        <>
          <ul className={styles.examplesList}>
            {Array.isArray(value?.examples) && value?.examples.length
              ? value?.examples.map((def: string) => (
                  <li key={def} className={styles.examplesItem}>
                    <span className={styles.example} key={def}>
                      {def}
                    </span>
                  </li>
                ))
              : null}
          </ul>
        </>
      </div>
    </div>
  );
};

export default memo(WordsCard);
