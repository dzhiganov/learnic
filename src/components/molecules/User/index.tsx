import React, { memo, useCallback } from 'react';
import Avatar from '@material-ui/core/Avatar';
import styles from './styles.module.css';
import useSelector from '~hooks/useSelector';

type Props = {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const User: React.FunctionComponent<Props> = ({ onClick }: Props) => {
  const photoURL = useSelector<string>('user.photoURL');

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        onClick(event);
      }
    },
    [onClick]
  );

  return (
    <div
      role="button"
      className={styles.container}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Avatar src={photoURL} className={styles.avatar} />
    </div>
  );
};

export default memo(User);
