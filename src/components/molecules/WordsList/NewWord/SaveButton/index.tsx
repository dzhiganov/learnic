import React, { memo } from 'react';
import styles from './styles.module.css';

type Props = {
  onSave: () => void;
};

const SaveButton: React.FunctionComponent<Props> = ({ onSave }: Props) => {
  return (
    <button className={styles.saveButton} type="button" onClick={onSave}>
      <span className={styles.saveTitle}>Save</span>
    </button>
  );
};

export default memo(SaveButton);
