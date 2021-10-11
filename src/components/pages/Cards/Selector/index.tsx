import React, { FC } from 'react';
import styles from './styles.module.css';
import { TrainingTypes } from '~shared/types';
import Card from './Card';

type Props = {
  counts: Record<
    TrainingTypes.All | TrainingTypes.Last | TrainingTypes.Repeat,
    number
  >;
  onSelect: (trainingType: TrainingTypes) => void;
};

const Selector: FC<Props> = ({ counts, onSelect }) => {
  return (
    <ul className={styles.list}>
      {Object.values(TrainingTypes).map((title) => {
        return (
          <li key={title}>
            <Card
              title={title}
              count={counts[title]}
              onClick={onSelect}
              isSpecial={title === TrainingTypes.Repeat}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default Selector;
