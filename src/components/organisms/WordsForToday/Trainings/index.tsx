import React from 'react';
import styles from './styles.module.css';
import TrainingTypes from '../consts/trainingTypes';
import TrainingItem from './TrainingItem';

type Props = {
  onSelectTraining: (type: TrainingTypes) => void;
};

// TODO use uniq id as keys
const Trainings: React.FunctionComponent<Props> = ({
  onSelectTraining,
}: Props) => {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {Object.values(TrainingTypes).map((type) => (
          <TrainingItem
            key={type}
            onSelect={onSelectTraining}
            type={type as TrainingTypes}
          />
        ))}
      </ul>
    </div>
  );
};

export default Trainings;
