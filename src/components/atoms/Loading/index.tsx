import React from 'react';
import styles from './styles.module.css';

const Loading: React.FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <span className={styles.icon} />
    </div>
  );
};

export default Loading;
