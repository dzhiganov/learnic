/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
// eslint-disable-next-line css-modules/no-unused-class
import styles from './Tag.module.css';

export enum Status {
  Inactive = 'inactive',
  Active = 'active',
  Suggested = 'suggested',
  New = 'new',
}

type TagProps = {
  name: string;
  onClick: () => void;
  status?: Status;
};

const Tag: React.FC<TagProps> = ({
  name,
  onClick,
  status = Status.Inactive,
  children,
}) => {
  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') {
      onClick();
    }
  };

  return (
    <label
      data-testid="tagLabel"
      className={`${styles.label} ${
        !status || status === Status.Inactive ? '' : styles[status]
      }`}
    >
      {name}
      {children}
      <input
        type="checkbox"
        className={styles.input}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      />
    </label>
  );
};

export default Tag;
