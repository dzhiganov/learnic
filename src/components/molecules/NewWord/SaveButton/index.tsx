import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

type Props = {
  onSave: () => void;
};

const SaveButton: React.FunctionComponent<Props> = ({ onSave }: Props) => {
  const { t } = useTranslation();

  return (
    <button className={styles.saveButton} type="button" onClick={onSave}>
      <span className={styles.saveTitle}>
        {t('DICTIONARY.NEW_WORD_WINDOW.SAVE_BUTTON')}
      </span>
    </button>
  );
};

export default memo(SaveButton);
