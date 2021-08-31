/* eslint-disable css-modules/no-unused-class */
import React, { memo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import AudioButton from '~c/atoms/AudioButton';
import InfoButton from '~c/atoms/InfoButton';

type Props = {
  word: string;
  translate: string;
  isActive: boolean;
  audio: string;
  setShowDefinition?: (value: boolean) => void;
};

const Card: React.FunctionComponent<Props> = ({
  word,
  translate,
  isActive,
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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div
          className={`${styles.front} ${flipped ? styles.frontFlipped : ''}`}
        >
          <div className={styles.topButtonsContainer}>
            <span className={styles.audioButtonContainer}>
              <AudioButton audioURL={audio} />
            </span>
            <span className={styles.showDefinitionButton}>
              {typeof setShowDefinition === 'function' && (
                <InfoButton onClick={() => setShowDefinition(true)} />
              )}
            </span>
          </div>

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
