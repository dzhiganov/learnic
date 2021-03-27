import React, { memo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useMedia from 'react-use/lib/useMedia';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import VideosList from '../VideosList';
import AddExample from './AddExample';
import useSelector from '~hooks/useSelector';
import { update } from '~api/words';
import { fetchWords } from '~actions/words';
import StepsPopup from './StepsPopup';
import { Words } from '~/core/store/models/words';
import AudioButton from '~c/atoms/AudioButton';

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
  const dispatch = useDispatch();
  const [showAddExample, setShowAddExample] = useState<boolean>(false);
  const uid = useSelector<string>('user.uid');
  // TODO set type imported from redux store
  const value = useSelector<Words>('words.all').find(
    ({ word: currentWord }: { word: string }) => currentWord === word
  );

  const handleClickAddExample = useCallback(() => {
    setShowAddExample(true);
  }, []);

  const handleCancelAddWord = useCallback(() => {
    setShowAddExample(false);
  }, []);

  const onAddNewExample = useCallback(
    async (example) => {
      await update({ uid, wordId: id, updatedFields: { example } });
      dispatch(fetchWords(uid));
      setShowAddExample(false);
    },

    [id, uid, dispatch]
  );

  const backToTheList = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!word) {
    return (
      <div className={styles.container}>
        <div className={styles.noSelectedWord}>
          <span role="img" aria-label="question">
            {t('DICTIONARY.SELECT_WORD')}
          </span>
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
        <div>
          <span>{`${word} - ${translate}`}</span>
        </div>

        <AudioButton audioURL={value?.audio || ''} />

        <StepsPopup
          step={value?.step || 0}
          repeat={(value?.repeat as unknown) as Date}
        />
      </div>
      <div className={styles.contextSection}>
        <div>
          <button
            className={styles.addExampleButton}
            type="button"
            onClick={handleClickAddExample}
          >
            {`+ ${t('DICTIONARY.WORD_CARD.ADD_EXAMPLE_BUTTON')}`}
          </button>
        </div>
        {showAddExample ? (
          <AddExample onSave={onAddNewExample} onCancel={handleCancelAddWord} />
        ) : null}
        <>
          <ul className={styles.examplesList}>
            {Array.isArray(value?.examples) && value?.examples.length
              ? value?.examples.map((def: string, i: number) => (
                  <li key={def} className={styles.examplesItem}>
                    <span className={styles.exampleCount}>{`${i + 1}) `}</span>
                    <span className={styles.example} key={def}>
                      {def}
                    </span>
                  </li>
                ))
              : null}
          </ul>
        </>
      </div>
      <div className={styles.videoSection}>
        {word ? <VideosList keyword={word} /> : null}
      </div>
    </div>
  );
};

export default memo(WordsCard);
