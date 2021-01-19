import React, { memo } from 'react';
import styles from './styles.module.css';

type Props = {
  onShowMore: () => void;
};

const ShowMore: React.FunctionComponent<Props> = ({ onShowMore }: Props) => {
  return (
    <button type="button" className={styles.button} onClick={onShowMore}>
      <span>Show more</span>
    </button>
  );
};

export default memo(ShowMore);
