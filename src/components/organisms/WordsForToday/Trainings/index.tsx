import React from 'react';
import styles from './styles.module.css';
import TrainingTypes from '../consts/trainingTypes';
import TrainingItem from './TrainingsItem';

type Props = {
  onSelectTraining: (type: TrainingTypes) => void;
};

const Trainings: React.FunctionComponent<Props> = ({
  onSelectTraining,
}: Props) => {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {Object.values(TrainingTypes).map((type) => (
          <TrainingItem
            onSelect={onSelectTraining}
            type={type as TrainingTypes}
          />
        ))}
      </ul>
    </div>
  );
};

export default Trainings;
