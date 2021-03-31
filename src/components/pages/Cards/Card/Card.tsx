/* eslint-disable css-modules/no-unused-class */
import React, { memo, useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import AudioButton from '~c/atoms/AudioButton';

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

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        setFlipped(!flipped);
      }
    },
    [flipped]
  );

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

  const handleClickShowDefinition = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();

      setShowDefinition(true);
    },
    [setShowDefinition]
  );

  return (
    <div className={styles.container}>
      <div
        role="button"
        className={`${styles.card} ${
          status !== 'pending' ? styles[classes[status]] : null
        }`}
        onClick={flip}
        onKeyPress={handleKeyPress}
        tabIndex={0}
      >
        <div
          className={`${styles.front} ${flipped ? styles.frontFlipped : ''}`}
        >
          <button
            type="button"
            className={styles.showDefinitionButton}
            onClick={handleClickShowDefinition}
          >
            💬
          </button>
          <span className={styles.cardTitle}>
            <span className={styles.audioButtonContainer}>
              <AudioButton audioURL={audio} />
            </span>
            {word}
          </span>

          <p className={styles.flip}>
            <span>{t('CARDS.FLIP')}</span>
          </p>
        </div>
        <div className={`${styles.back} ${flipped ? styles.backFlipped : ''}`}>
          <span className={styles.cardTitle}>{translate}</span>
          <p className={styles.flip}>
            <span>{t('CARDS.FLIP')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(Card);
