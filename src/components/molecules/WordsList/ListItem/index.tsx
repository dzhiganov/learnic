/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, memo, useCallback } from 'react';
import styles from './styles.module.css';
import ActionButtons from './ActionButtons';

type Props = {
  id: string;
  word: string;
  translate: string;
  clearFilter: () => void;
  onClick: (props: { id: string; word: string; translate: string }) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  setFocused: (id: string) => void;
  isFocused: boolean;
};

const ListItem: FC<Props> = ({
  id,
  word,
  translate,
  clearFilter,
  onClick,
  onDelete,
  onEdit,
  setFocused,
  isFocused,
}) => {
  const handleMouseDown = () => setFocused(id);

  const handleOnClick = () => onClick({ id, word, translate });

  const handleEdit = useCallback(() => {
    clearFilter();
    onEdit(id);
  }, [clearFilter, id, onEdit]);

  const handleDelete = useCallback(() => {
    clearFilter();
    onDelete(id);
  }, [clearFilter, id, onDelete]);

  return (
    <li
      role="button"
      className={styles.cardItem}
      key={id}
      onMouseEnter={handleMouseDown}
      tabIndex={0}
      onKeyDown={handleOnClick}
      onClick={handleOnClick}
    >
      <div className={styles.cardItemContainer}>
        <a
          role="button"
          className={`${styles.cardItemTextContainer} ${
            isFocused ? styles.cardItemTextContainerHovered : ''
          }`}
        >
          <span className={styles.cardButton}>{`${word} - ${translate}`}</span>
        </a>

        {isFocused && (
          <ActionButtons onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </li>
  );
};

export default memo(ListItem);
