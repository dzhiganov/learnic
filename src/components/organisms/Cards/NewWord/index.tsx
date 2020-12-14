import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import { useSelector } from 'react-redux';
import translateApi from 'core/store/api/translate';
import useDebounce from 'react-use/lib/useDebounce';
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
  const { token } = useSelector(
    ({ translate: translateState }: { translate: { token: string } }) =>
      translateState
  );

  const [, cancel] = useDebounce(
    async () => {
      const res = (await translateApi.getTranslate(
        token,
        word,
        '1033',
        '1049'
      )) as {
        Translation: {
          Translation: string;
        };
      };
      const {
        Translation: { Translation: dictionaryTranslate },
      } = res;
      const [value] = dictionaryTranslate.split(',');
      setTranslate(value);
    },
    500,
    [token, word]
  );

  useEffect(() => {
    if (inputRef.current && typeof inputRef.current.focus === 'function') {
      inputRef.current.focus();
    }
  }, []);

  const handleOnChangeWord = useCallback(({ target: { value = '' } = {} }) => {
    setWord(value);
  }, []);

  const handleOnChangeTranslate = useCallback(
    async ({ target: { value = '' } = {} }) => {
      cancel();
      setTranslate(value);
    },
    [cancel]
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
        <button
          onClick={handleOnSave}
          type="button"
          className={styles.saveButton}
        >
          <CheckIcon />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default memo(NewWord);
