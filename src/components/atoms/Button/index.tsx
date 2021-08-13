import React, { memo } from 'react';
import styles from './styles.module.css';

type Props = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

const Button: React.FC<Props> = ({
  title,
  onClick,
  disabled = false,
  className,
}: Props) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default memo(Button);
