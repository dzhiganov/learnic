import React, { memo, useCallback } from 'react';
import Avatar from '@material-ui/core/Avatar';
import styles from './styles.module.css';

type Props = {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const User: React.FunctionComponent<Props> = ({ onClick }: Props) => {
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
      <Avatar src="/broken-image.jpg" />
    </div>
  );
};

export default memo(User);
