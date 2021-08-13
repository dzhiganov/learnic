/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import styles from './styles.module.css';

type Sizes = 'normal' | 'large';

type Props = {
  size?: Sizes;
  className?: string;
};

const Logo: React.FC<Props> = ({ size = 'normal', className }) => {
  return (
    <div className={`${styles.logo} ${styles[size]} ${className}`}>
      <span>Learnic</span>
    </div>
  );
};

export default Logo;
