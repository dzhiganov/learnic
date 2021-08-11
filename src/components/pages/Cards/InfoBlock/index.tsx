import React from 'react';
import styles from './styles.module.css';

type Props = {
  successful: number;
  failed: number;
};

const InfoBlock: React.FC<Props> = ({ successful, failed }) => {
  return (
    <div className={styles.container}>
      <h2>🚀 Your results</h2>
      <p className={styles.done}>{`Done ${successful}`}</p>
      <p className={styles.repeat}>{`Repeat ${failed}`}</p>
    </div>
  );
};

export default InfoBlock;
