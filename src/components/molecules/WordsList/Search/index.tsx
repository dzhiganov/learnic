import React, { memo } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import styles from './styles.module.css';

type Props = {
  value: string;
  onChange: React.FormEventHandler<HTMLInputElement>;
  onFocus: () => void;
  onBlur: () => void;
};

const Search: React.FunctionComponent<Props> = ({
  value,
  onChange,
  onFocus,
  onBlur,
}: Props) => {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>
        <SearchIcon />
      </span>
      <input
        value={value}
        onChange={onChange}
        className={styles.input}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};

export default memo(Search);
