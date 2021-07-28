import React, { FC } from 'react';
import styles from './styles.module.css';

type Props = {
  onEdit: React.MouseEventHandler<HTMLButtonElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
};

const ActionButtons: FC<Props> = ({ onEdit, onDelete }) => {
  return (
    <div className={styles.icons}>
      <button type="button" className={styles.actionButton} onClick={onEdit}>
        Edit
      </button>
      <button
        type="button"
        className={`${styles.actionButton} ${styles.deleteButton}`}
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default ActionButtons;
