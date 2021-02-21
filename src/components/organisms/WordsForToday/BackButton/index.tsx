import React, { memo } from 'react';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

type Props = {
  onBack: () => void;
};

const BackButton: React.FunctionComponent<Props> = ({ onBack }: Props) => {
  const { t } = useTranslation();

  return (
    <div className={styles.backButtonContainer}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        <KeyboardBackspaceIcon className={styles.backIcon} />
        {t('TRAINING.BACK_TO_THE_LIST_BUTTON')}
      </button>
    </div>
  );
};

export default memo(BackButton);
