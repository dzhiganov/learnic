import React, { memo, useCallback, useMemo } from 'react';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import styles from './styles.module.css';

type Props = {
  audioURL: string;
};

const AudioButton: React.FC<Props> = ({ audioURL }: Props) => {
  const audio = useMemo((): HTMLAudioElement | null => {
    if (audioURL) {
      return new Audio(audioURL);
    }
    return null;
  }, [audioURL]);

  const handlePlayAudio = useCallback(() => {
    if (audio && typeof audio.play === 'function') audio.play();
  }, [audio]);

  if (!audioURL) {
    return null;
  }

  return (
    <span className={styles.audioButtonContainer}>
      <button
        className={styles.audioButton}
        type="button"
        onClick={handlePlayAudio}
      >
        <VolumeUpIcon />
      </button>
    </span>
  );
};

export default memo(AudioButton);
