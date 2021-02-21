import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

type Props = {
  onSave: (example: string) => Promise<void>;
  onCancel: () => void;
};

const AddExample: React.FunctionComponent<Props> = ({
  onSave,
  onCancel,
}: Props) => {
  const { t } = useTranslation();
  const [example, setExample] = useState<string>('');

  const handleOnSave = useCallback(async () => {
    await onSave(example);
    setExample('');
  }, [onSave, example]);

  const handleChangeInput = useCallback((e) => {
    const { value } = e.target;
    setExample(value);
  }, []);

  return (
    <div>
      <div className={styles.inputContainer}>
        <textarea
          className={styles.input}
          value={example}
          onChange={handleChangeInput}
        />
      </div>
      <div className={styles.buttonsContainer}>
        <button
          className={styles.saveButton}
          type="button"
          onClick={handleOnSave}
        >
          {t('DICTIONARY.WORD_CARD.SAVE_BUTTON')}
        </button>
        <button
          className={styles.cancelButton}
          type="button"
          onClick={onCancel}
        >
          {t('DICTIONARY.WORD_CARD.CANCEL_BUTTON')}
        </button>
      </div>
    </div>
  );
};

export default memo(AddExample);
