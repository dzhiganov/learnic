import React, { memo } from 'react';
import styles from './styles.module.css';

type Props = {
  onCancel: () => void;
};

const CancelButton: React.FunctionComponent<Props> = ({ onCancel }: Props) => {
  return (
    <button className={styles.cancelButton} type="button" onClick={onCancel}>
      <span className={styles.saveTitle}>Cancel</span>
    </button>
  );
};

export default memo(CancelButton);
