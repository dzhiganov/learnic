import React, { memo, useCallback, useState, useRef } from 'react';
import styles from './styles.module.css';
import SaveButton from '~c/molecules/NewWord/SaveButton';

type Props = {
  onSave: (example: string) => Promise<void>;
};

const AddExample: React.FunctionComponent<Props> = ({ onSave }: Props) => {
  const [example, setExample] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <textarea
          ref={textAreaRef}
          className={styles.input}
          value={example}
          onChange={handleChangeInput}
          rows={4}
          placeholder="Add another one..."
        />
      </div>
      <div className={styles.buttonsContainer}>
        <SaveButton onSave={handleOnSave} disabled={!example} />
      </div>
    </div>
  );
};

export default memo(AddExample);
