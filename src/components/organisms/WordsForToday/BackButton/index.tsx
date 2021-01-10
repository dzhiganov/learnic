import React, { memo } from 'react';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import styles from './styles.module.css';

type Props = {
  onBack: () => void;
};

const BackButton: React.FunctionComponent<Props> = ({ onBack }: Props) => (
  <div className={styles.backButtonContainer}>
    <button type="button" className={styles.backButton} onClick={onBack}>
      <KeyboardBackspaceIcon className={styles.backIcon} />
      Back to the training list
    </button>
  </div>
);

export default memo(BackButton);
