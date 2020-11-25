import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import styles from './styles.module.css';

type Props = {
  onSave: ({
    word,
    translate,
  }: {
    word: string;
    translate: string;
  }) => Promise<void>;
};

const NewWord: React.FunctionComponent<Props> = ({ onSave }: Props) => {
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);
  const [word, setWord] = useState('');
  const [translate, setTranslate] = useState('');

  useEffect(() => {
    if (inputRef.current && typeof inputRef.current.focus === 'function') {
      inputRef.current.focus();
    }
  }, []);

  const handleOnChangeWord = useCallback(({ target: { value = '' } = {} }) => {
    setWord(value);
  }, []);

  const handleOnChangeTranslate = useCallback(
    ({ target: { value = '' } = {} }) => {
      setTranslate(value);
    },
    []
  );

  const handleOnSave = useCallback(async (): Promise<void> => {
    await onSave({ word, translate });

    setWord('');
    setTranslate('');
  }, [translate, word, onSave]);

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={word}
          onChange={handleOnChangeWord}
          ref={inputRef}
        />
        <input
          className={styles.input}
          value={translate}
          onChange={handleOnChangeTranslate}
        />
      </div>
      <div>
        <button type="button" className={styles.saveButton}>
          <CheckIcon onClick={handleOnSave} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default memo(NewWord);
