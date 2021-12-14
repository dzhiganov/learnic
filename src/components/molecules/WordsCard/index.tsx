/* eslint-disable css-modules/no-unused-class */
import React, { memo, useMemo } from 'react';
import useMedia from 'react-use/lib/useMedia';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import Tag, { Status } from 'components/molecules/NewWord/Tags/Tag/Tag';
import styles from './styles.module.css';
import AddExample from './AddExample';
import useSelector from '~hooks/useSelector';
import StepsPopup from './StepsPopup';
import AudioButton from '~c/atoms/AudioButton';
import getWords from '~graphql/queries/getWords';
import { GetWordsQueryResult } from '~shared/types';
import ActionsButtons from './ActionButtons';
import ExampleItem from './ExampleItem/ExampleItem';

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

  const backToTheList = () => onClose();

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
        {value?.tags.length ? (
          <div className={styles.tagsContainer}>
            <div className={styles.tagsTitle}>
              <span>Tags</span>
            </div>
            <ul className={styles.tags}>
              {value?.tags
                .filter((tag) => tag.name)
                .map((tag) => (
                  <li key={tag.id}>
                    <Tag name={tag.name} status={Status.Active} />
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          ''
        )}
        <div className={styles.examples}>
          <div className={styles.examplesTitle}>
            <span>{`${t('DICTIONARY.WORD_CARD.EXAMPLES_TITLE')}`}</span>
          </div>
        </div>
        <ul className={styles.examplesList}>
          {Array.isArray(value?.examples) && value?.examples.length ? (
            value?.examples.map(({ id: exampleId, text }) => (
              <ExampleItem
                key={exampleId}
                id={exampleId}
                wordId={id}
                text={text}
              />
            ))
          ) : (
            <p className={styles.noExamples}>
              There are no examples so far. Let&apos;s add the first one!
            </p>
          )}
        </ul>
      </div>
      <AddExample wordId={id} />
    </div>
  );
};

export default memo(WordsCard);
