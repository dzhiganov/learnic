import React from 'react';
import styles from './styles.module.css';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Base = ({ children }: Props): React.ReactElement => (
  <div className={styles.container}>{children}</div>
);

export default Base;
