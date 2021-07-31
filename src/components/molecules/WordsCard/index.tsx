/* eslint-disable css-modules/no-unused-class */
import React, { memo, useCallback, useMemo } from 'react';
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
import ActionsButtons from './ActionButtons';

type Props = {
  id: string;
  word: string;
  translate: string;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const WordsCard: React.FunctionComponent<Props> = ({
  id,
  word,
  translate,
  onClose,
  onEdit,
  onDelete,
}: Props) => {
  const { t } = useTranslation();
  const isWide = useMedia('(min-width: 576px)');
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

  const onAddNewExample = useCallback(
    async (example) => {
      await fetchUpdate({
        variables: { uid, id, updatedFields: { example } },
      });
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
      <header className={styles.wordCardHeader}>
        <ActionsButtons
          onEdit={() => typeof value?.id === 'string' && onEdit(value?.id)}
          onDelete={() => typeof value?.id === 'string' && onDelete(value?.id)}
        />
      </header>
      <div className={styles.wordSection}>
        <div className={styles.wordContainer}>
          <span>{`${word} - ${translate}`}</span>
        </div>

        <div className={styles.buttons}>
          <AudioButton
            audioURL={value?.audio || ''}
            transcription={value?.transcription || ''}
          />

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
        </div>
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
      </div>
      <AddExample onSave={onAddNewExample} />
    </div>
  );
};

export default memo(WordsCard);
