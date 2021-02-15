import React from 'react';
import TopBar from '~c/organisms/TopBar';
import styles from './styles.module.css';

const Promo: React.FunctionComponent = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <TopBar />
        <div className={styles.content}>Content</div>
      </div>
    </div>
  );
};

export default Promo;
