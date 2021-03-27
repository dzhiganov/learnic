import React from 'react';
import styles from './styles.module.css';
import TopBar from '~c/organisms/TopBar';
import Wrapper from '~c/atoms/Wrapper';

const Base: React.FC = ({ children }) => (
  <div className={styles.container}>
    <TopBar />
    <div className={styles.grid}>
      <Wrapper>
        <div className={styles.content}>{children}</div>
      </Wrapper>
    </div>
  </div>
);

export default Base;
