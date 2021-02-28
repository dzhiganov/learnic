import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import Repeat from './Repeat';

type Props = {
  results: [number, number];
  onRepeat: () => void;
};

const Results: React.FunctionComponent<Props> = ({
  results,
  onRepeat,
}: Props) => {
  const { t } = useTranslation();
  const [success, failed] = results;

  return (
    <div>
      <div className={styles.definition}>
        <div>
          <span className={`${styles.title} ${styles.success}`}>
            {t('TRAINING.RESULTS.SUCCESED')}
          </span>
          <span className={styles.count}>{`: ${success}`}</span>
        </div>
        <div>
          <span className={`${styles.title} ${styles.failed}`}>
            {t('TRAINING.RESULTS.FAILED')}
          </span>
          <span className={styles.count}>{`: ${failed}`}</span>
        </div>
      </div>
      <Repeat onRepeat={onRepeat} />
    </div>
  );
};

export default memo(Results);
