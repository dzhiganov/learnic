import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

type Props = {
  onCancel: () => void;
};

const CancelButton: React.FunctionComponent<Props> = ({ onCancel }: Props) => {
  const { t } = useTranslation();
  return (
    <button className={styles.cancelButton} type="button" onClick={onCancel}>
      <span className={styles.saveTitle}>
        {t('DICTIONARY.NEW_WORD_WINDOW.CANCEL_BUTTON')}
      </span>
    </button>
  );
};

export default memo(CancelButton);
