import React, { FC } from 'react';
import { TrainingTypes } from '~shared/types';
import styles from './styles.module.css';

type Props = {
  title: TrainingTypes;
  count: number;
  onClick: (title: TrainingTypes) => void;
};

const Card: FC<Props> = ({ title, count, onClick }) => {
  const handleClick = () => onClick(title);
  const handleKeyDown = () => {};

  return (
    <div
      className={styles.card}
      tabIndex={0}
      role="button"
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <span className={styles.title}>{title}</span>
      <div className={styles.count}>
        <span>{`${count} words`}</span>
      </div>
    </div>
  );
};

export default Card;
