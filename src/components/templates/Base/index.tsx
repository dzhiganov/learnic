import React from 'react';
import styles from './styles.module.css';
import AsideMenu from '~c/organisms/AsideMenu';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Base = ({ children }: Props): React.ReactElement => (
  <div className={styles.container}>
    <AsideMenu />
    <div className={styles.content}>{children}</div>
  </div>
);

export default Base;
