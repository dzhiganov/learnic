import React, { memo, useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styled.module.css';

type Props = {
  word: string;
  translate: string;
  isActive: boolean;
  status: 'successful' | 'failed' | 'pending';
};

const Card: React.FunctionComponent<Props> = ({
  word,
  translate,
  isActive,
  status,
}: Props) => {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState<boolean>();

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
          <p className={styles.cardTitle}>{word}</p>
          <p className={styles.flip}>
            <span>{t('CARDS.FLIP')}</span>
          </p>
        </div>
        <div className={`${styles.back} ${flipped ? styles.backFlipped : ''}`}>
          <p className={styles.cardTitle}>{translate}</p>
          <p className={styles.flip}>
            <span>{t('CARDS.FLIP')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(Card);
