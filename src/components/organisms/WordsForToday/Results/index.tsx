import React, { memo } from 'react';
import styles from './styles.module.css';

type Props = {
  results: [number, number];
};

const Results: React.FunctionComponent<Props> = ({ results }: Props) => {
  const [success, failed] = results;

  return (
    <p className={styles.definition}>
      <span>{`Done! Success ${success}, Failed ${failed}`}</span>
    </p>
  );
};

export default memo(Results);
