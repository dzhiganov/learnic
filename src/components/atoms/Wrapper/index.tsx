import React, { memo } from 'react';
import styles from './styles.module.css';

type Props = {
  children: JSX.Element | JSX.Element[];
};

const Wrapper: React.FunctionComponent<Props> = ({ children }: Props) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default memo(Wrapper);
