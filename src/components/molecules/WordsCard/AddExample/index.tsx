import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import SaveButton from '~c/molecules/NewWord/SaveButton';
import CancelButton from '~c/molecules/NewWord/CancelButton';

type Props = {
  onSave: (example: string) => Promise<void>;
  onCancel: () => void;
};

const AddExample: React.FunctionComponent<Props> = ({
  onSave,
  onCancel,
}: Props) => {
  const [example, setExample] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const setFocusOnTextArea = useCallback(() => {
    if (
      textAreaRef.current &&
      typeof textAreaRef.current.focus === 'function'
    ) {
      textAreaRef.current.focus();
    }
  }, []);

  const handleOnSave = useCallback(async () => {
    if (!example) {
      return;
    }
    await onSave(example);
    setExample('');
  }, [onSave, example]);

  const handleChangeInput = useCallback((e) => {
    const { value } = e.target;
    setExample(value);
  }, []);

  useEffect(() => {
    setFocusOnTextArea();
  }, [setFocusOnTextArea]);

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <textarea
          ref={textAreaRef}
          className={styles.input}
          value={example}
          onChange={handleChangeInput}
          rows={4}
        />
      </div>
      <div className={styles.buttonsContainer}>
        <SaveButton onSave={handleOnSave} disabled={!example} />
        <CancelButton onCancel={onCancel} />
      </div>
    </div>
  );
};

export default memo(AddExample);
