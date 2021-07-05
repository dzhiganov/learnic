import React, { FC } from 'react';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import styles from './styles.module.css';

type Props = {
  onEdit: React.MouseEventHandler<HTMLButtonElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
};

const ActionButtons: FC<Props> = ({ onEdit, onDelete }) => {
  return (
    <div className={styles.icons}>
      <button type="button" className={styles.actionButton} onClick={onEdit}>
        <EditIcon />
      </button>
      <button type="button" className={styles.actionButton} onClick={onDelete}>
        <DeleteIcon />
      </button>
    </div>
  );
};

export default ActionButtons;
