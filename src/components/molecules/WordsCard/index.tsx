/* eslint-disable jsx-a11y/media-has-caption */
import React, { memo, useEffect, useCallback, useMemo } from 'react';
import dictionaryApi from 'core/store/api/dictionary';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import styles from './styles.module.css';
import VideosList from '../VideosList';
import { getExamples } from './utils';
import Skeleton from '../../atoms/Skeleton';

type Props = {
  word: string;
  translate: string;
};

const defaultDefinition = {
  examples: [],
  audio: '',
};

const WordsCard: React.FunctionComponent<Props> = ({
  word,
  translate,
}: Props) => {
  const [{ value = defaultDefinition, loading }, getDefinition] = useAsyncFn(
    async (keyword: string): Promise<{ examples: string[]; audio: string }> => {
      const data = await dictionaryApi.getDefinition(keyword);

      if (data && Array.isArray(data)) {
        const { examples: resExamples, audio: resAudio } = getExamples(data);

        return {
          examples: resExamples,
          audio: resAudio as string,
        };
      }

      return defaultDefinition;
    },
    [],
    { loading: true }
  );

  useEffect(() => {
    if (word) {
      getDefinition(word);
    }
  }, [word, getDefinition]);

  const audio = useMemo((): HTMLAudioElement | null => {
    if (value?.audio) {
      return new Audio(value.audio);
    }
    return null;
  }, [value]);

  const handlePlayAudio = useCallback(() => {
    if (audio && typeof audio.play === 'function') audio.play();
  }, [audio]);

  return (
    <div className={styles.container}>
      <div className={styles.wordSection}>
        <div>
          <span>{`${word}-${translate}`}</span>
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
        {loading ? (
          <ul className={styles.examplesList}>
            <Skeleton variant="text" width={512} height={40} repeat={3} />
          </ul>
        ) : (
          <ul className={styles.examplesList}>
            {Array.isArray(value.examples) && value.examples.length
              ? value.examples
                  .filter((def) => def)
                  .map((def) => (
                    <li key={def} className={styles.examplesItem}>
                      <span className={styles.example} key={def}>
                        {def}
                      </span>
                    </li>
                  ))
              : null}
          </ul>
        )}
      </div>
      <div className={styles.videoSection}>
        {word ? <VideosList keyword={word} /> : null}
      </div>
    </div>
  );
};

export default memo(WordsCard);
