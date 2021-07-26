/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, memo } from 'react';
import styles from './styles.module.css';

type Props = {
  id: string;
  word: string;
  translate: string;
  onClick: (props: { id: string; word: string; translate: string }) => void;
  setFocused: (id: string) => void;
  isFocused: boolean;
};

const ListItem: FC<Props> = ({
  id,
  word,
  translate,
  onClick,
  setFocused,
  isFocused,
}) => {
  const handleMouseDown = () => setFocused(id);

  const handleOnClick = () => onClick({ id, word, translate });

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
      </div>
    </li>
  );
};

export default memo(ListItem);
