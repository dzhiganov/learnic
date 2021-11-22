import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SpinnerIcon } from '@chakra-ui/icons';
import styles from './styles.module.css';

type Props = {
  onSave: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const SaveButton: React.FunctionComponent<Props> = ({
  onSave,
  disabled = false,
  loading = false,
}: Props) => {
  const { t } = useTranslation();

  return (
    <button
      className={styles.saveButton}
      type="button"
      onClick={onSave}
      disabled={disabled}
    >
      {loading ? (
        <SpinnerIcon className={styles.loader} />
      ) : (
        <span>{t('DICTIONARY.NEW_WORD_WINDOW.SAVE_BUTTON')}</span>
      )}
    </button>
  );
};

export default memo(SaveButton);
