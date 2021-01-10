import React, { memo, useCallback } from 'react';
import type { TrainingTypes } from '..';
import styles from './styles.module.css';
import typesData from '../consts/typesData';

type Props = {
  onSelect: (type: TrainingTypes) => void;
  type: TrainingTypes;
};

const TrainingsItem: React.FunctionComponent<Props> = ({
  onSelect,
  type,
}: Props) => {
  const handleOnClick = useCallback(() => onSelect(type), [type, onSelect]);
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        onSelect(type);
      }
    },
    [type, onSelect]
  );

  return (
    <li>
      <div
        role="button"
        className={styles.styledItem}
        onClick={handleOnClick}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.itemTitle}>{typesData[type].title}</div>
        <div className={styles.itemDef}>{typesData[type].definition}</div>
      </div>
    </li>
  );
};

export default memo(TrainingsItem);
