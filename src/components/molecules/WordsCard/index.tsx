/* eslint-disable jsx-a11y/media-has-caption */
import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import { useDispatch } from 'react-redux';
import useMedia from 'react-use/lib/useMedia';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import styles from './styles.module.css';
import VideosList from '../VideosList';
import AddExample from './AddExample';
import useSelector from '~hooks/useSelector';
import { update } from '~api/words';
import { fetchWords } from '~actions/words';

type Props = {
  id: string;
  word: string;
  translate: string;
  onClose: () => void;
};

const defaultDefinition = {
  examples: [],
  audio: '',
};

const WordsCard: React.FunctionComponent<Props> = ({
  id,
  word,
  translate,
  onClose,
}: Props) => {
  const isWide = useMedia('(min-width: 576px)');
  const dispatch = useDispatch();
  const [showAddExample, setShowAddExample] = useState<boolean>(false);
  const uid = useSelector('user.uid');
  // TODO set type imported from redux store
  const value =
    useSelector('words.all').find(
      ({ word: currentWord }: { word: string }) => currentWord === word
    ) || defaultDefinition;

  useEffect(() => {
    if (word) {
      fetch(word);
    }
  }, [word]);

  const audio = useMemo((): HTMLAudioElement | null => {
    if (value?.audio) {
      return new Audio(value.audio);
    }
    return null;
  }, [value]);

  const handlePlayAudio = useCallback(() => {
    if (audio && typeof audio.play === 'function') audio.play();
  }, [audio]);

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
            🤔 Select some word...
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

        <div className={styles.audioButtonContainer}>
          <button
            className={styles.audioButton}
            type="button"
            onClick={handlePlayAudio}
          >
            <VolumeUpIcon />
          </button>
        </div>
      </div>
      <div className={styles.contextSection}>
        <div>
          <button
            className={styles.addExampleButton}
            type="button"
            onClick={handleClickAddExample}
          >
            + Add example
          </button>
        </div>
        {showAddExample ? (
          <AddExample onSave={onAddNewExample} onCancel={handleCancelAddWord} />
        ) : null}
        <>
          <ul className={styles.examplesList}>
            {Array.isArray(value.examples) && value.examples.length
              ? value.examples.map((def: string) => (
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
      <div className={styles.videoSection}>
        {word ? <VideosList keyword={word} /> : null}
      </div>
    </div>
  );
};

export default memo(WordsCard);
