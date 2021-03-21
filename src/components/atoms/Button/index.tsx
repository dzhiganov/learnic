import React, { memo } from 'react';
import styles from './styles.module.css';

type Props = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
};

const Button: React.FC<Props> = ({
  title,
  onClick,
  disabled = false,
}: Props) => {
  return (
    <button
      className={styles.button}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default memo(Button);
