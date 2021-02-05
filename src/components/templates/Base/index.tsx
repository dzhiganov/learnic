import React from 'react';
import styles from './styles.module.css';
import AsideMenu from '~c/organisms/AsideMenu';
import TopBar from '~c/organisms/TopBar';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Base = ({ children }: Props): React.ReactElement => (
  <div className={styles.container}>
    <TopBar />
    <div className={styles.grid}>
      <div className={styles.wrapper}>
        <AsideMenu />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  </div>
);

export default Base;
