import React, { FC } from 'react';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import styles from './styles.module.css';

type Props = {
  onClick: () => void;
};

const InfoButton: FC<Props> = ({ onClick }) => {
  return (
    <span className={styles.container}>
      <button className={styles.button} type="button" onClick={onClick}>
        <LiveHelpIcon />
      </button>
    </span>
  );
};

export default InfoButton;
