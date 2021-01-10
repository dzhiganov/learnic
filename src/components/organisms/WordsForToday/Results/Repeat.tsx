import React, { useCallback, memo } from 'react';
import ReplayIcon from '@material-ui/icons/Replay';
import styles from './styles.module.css';

type Props = {
  onRepeat: () => void;
};

const Repeat: React.FunctionComponent<Props> = ({ onRepeat }: Props) => {
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        onRepeat();
      }
    },
    [onRepeat]
  );
  return (
    <div
      role="button"
      className={styles.repeatIconContainer}
      onClick={onRepeat}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <ReplayIcon />
    </div>
  );
};

export default memo(Repeat);
