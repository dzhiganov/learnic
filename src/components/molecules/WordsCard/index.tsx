/* eslint-disable jsx-a11y/media-has-caption */
import React, { memo, useEffect, useCallback, useState, useMemo } from 'react';
import dictionaryApi from 'core/store/api/dictionary';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import styles from './styles.module.css';
import VideosList from '../VideosList';

type Props = {
  word: string;
  translate: string;
};

const getExamples = (
  data: Array<{
    meanings: Array<
      Record<string, unknown> & {
        definitions: Array<{ example: string }>;
      }
    >;
    phonetics: Array<Record<string, unknown>>;
  }>
) => {
  const [wordData] = data;
  const { meanings, phonetics: phoneticsList } = wordData;
  const [phonetics] = phoneticsList;
  const { audio } = phonetics;

  const result = meanings.reduce(
    (
      acc: string[],
      item: Record<string, unknown> & {
        definitions: Array<{ example: string }>;
      }
    ) => {
      const { definitions } = item;
      definitions.forEach(({ example }) => acc.push(example));
      return acc;
    },
    []
  );

  return {
    examples: result,
    audio,
  };
};

const WordsCard: React.FunctionComponent<Props> = ({
  word,
  translate,
}: Props) => {
  const [examples, setExamples] = useState<string[]>([]);
  const [audioSrc, setAudioSrc] = useState<string>('');
  const getDefinition = useCallback(async () => {
    const data = await dictionaryApi.getDefinition(word);

    if (data && Array.isArray(data)) {
      const { examples: resExamples, audio: resAudio } = getExamples(data);
      setExamples(resExamples);
      setAudioSrc(resAudio as string);
    }
  }, [word]);

  useEffect(() => {
    if (word) {
      getDefinition();
    }
  }, [word, getDefinition]);

  const audio = useMemo(() => {
    return new Audio(audioSrc);
  }, [audioSrc]);

  const handlePlayAudio = useCallback(() => {
    audio.play();
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
        <ul className={styles.examplesList}>
          {Array.isArray(examples) && examples.length
            ? examples
                .filter((def) => def)
                .map((def) => (
                  <li className={styles.examplesItem}>
                    <span className={styles.example} key={def}>
                      {def}
                    </span>
                  </li>
                ))
            : null}
        </ul>
      </div>
      <div className={styles.videoSection}>
        {word ? <VideosList keyword={word} /> : null}
      </div>
    </div>
  );
};

export default memo(WordsCard);
