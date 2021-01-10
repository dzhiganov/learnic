import React, { memo } from 'react';
import styles from './styles.module.css';
import Repeat from './Repeat';

type Props = {
  results: [number, number];
  onRepeat: () => void;
};

const Results: React.FunctionComponent<Props> = ({
  results,
  onRepeat,
}: Props) => {
  const [success, failed] = results;

  return (
    <div>
      <p className={styles.definition}>
        <span>{`Done! Success ${success}, Failed ${failed}`}</span>
      </p>
      <Repeat onRepeat={onRepeat} />
    </div>
  );
};

export default memo(Results);
