import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

type Props = {
  TODO?: () => void;
};

const NoWordsForToday: React.FunctionComponent<Props> = () => {
  const { t } = useTranslation();

  return (
    <span className={styles.title} role="img" aria-label="emoji">
      🙄 {t('TRAINING.NO_TRAINING_WORDS')}
    </span>
  );
};

export default memo(NoWordsForToday);
