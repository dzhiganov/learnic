import React from 'react';
import styles from './styles.module.css';

const NoWord: React.FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <p className={styles.definition}>🤷</p>
    </div>
  );
};

export default NoWord;
