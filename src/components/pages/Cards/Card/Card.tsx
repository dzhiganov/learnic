/* eslint-disable css-modules/no-unused-class */
import React, { memo, useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import AudioButton from '~c/atoms/AudioButton';
import InfoButton from '~c/atoms/InfoButton';

type Props = {
  word: string;
  translate: string;
  isActive: boolean;
  status: 'successful' | 'failed' | 'pending';
  audio: string;
  setShowDefinition: (value: boolean) => void;
};

const Card: React.FunctionComponent<Props> = ({
  word,
  translate,
  isActive,
  status,
  audio,
  setShowDefinition,
}: Props) => {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState<boolean>(false);

  const flip = useCallback(() => {
    setFlipped(!flipped);
  }, [flipped]);

  useEffect(() => {
    if (word && translate) {
      setFlipped(false);
    }
  }, [word, translate]);

  useEffect(() => {
    if (!isActive && flipped) {
      setFlipped(false);
    }
  }, [flipped, isActive]);

  const classes = useMemo(() => {
    return {
      successful: 'cardSuccess',
      failed: 'cardFailed',
    };
  }, []);

  const handleClickShowDefinition = useCallback(() => {
    setShowDefinition(true);
  }, [setShowDefinition]);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.card} ${
          status !== 'pending' ? styles[classes[status]] : null
        }`}
      >
        <div
          className={`${styles.front} ${flipped ? styles.frontFlipped : ''}`}
        >
          <span className={styles.audioButtonContainer}>
            <AudioButton audioURL={audio} />
          </span>
          <span className={styles.showDefinitionButton}>
            <InfoButton onClick={handleClickShowDefinition} />
          </span>
          <span className={styles.cardTitle}>{word}</span>

          <button type="button" className={styles.flip} onClick={flip}>
            <span>{t('CARDS.FLIP')}</span>
          </button>
        </div>
        <div className={`${styles.back} ${flipped ? styles.backFlipped : ''}`}>
          <span className={styles.cardTitle}>{translate}</span>
          <button type="button" className={styles.flip} onClick={flip}>
            <span>{t('CARDS.FLIP')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Card);
