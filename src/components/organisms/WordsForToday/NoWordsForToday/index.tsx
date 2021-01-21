import React, { memo } from 'react';
import styles from './styles.module.css';

type Props = {
  TODO?: () => void;
};

const NoWordsForToday: React.FunctionComponent<Props> = () => {
  return (
    <span className={styles.title} role="img" aria-label="emoji">
      🙄 You don&apos;t have words for training today
    </span>
  );
};

export default memo(NoWordsForToday);
