/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import styles from './styles.module.css';

type Sizes = 'normal' | 'large';

type Props = {
  name?: Logos;
  size?: Sizes;
  className?: string;
};

export enum Logos {
  TextColorLogo = '/text-color-logo.png',
  Logo = '/logo.png',
  FullLogo = '/new-logo.png',
}

const Logo: React.FC<Props> = ({
  name = Logos.Logo,
  size = 'normal',
  className,
}) => {
  return (
    <div className={`${styles.logo} ${styles[size]} ${className}`}>
      <img src={name} alt="logo" style={{ width: 'inherit' }} />
    </div>
  );
};

export default Logo;
