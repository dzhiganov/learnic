import React, { FC } from 'react';
import styles from './styles.module.css';
import { TrainingTypes } from '~shared/types';
import Card from './Card';

type Props = {
  counts: Record<TrainingTypes, number>;
};

const Selector: FC<Props> = ({ counts }) => {
  const onSelect = (title: TrainingTypes) => {
    return title;
  };
  return (
    <ul className={styles.list}>
      {Object.values(TrainingTypes).map((title) => {
        return (
          <li>
            <Card title={title} count={counts[title]} onClick={onSelect} />
          </li>
        );
      })}
    </ul>
  );
};

export default Selector;
