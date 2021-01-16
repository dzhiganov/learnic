import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'core/store/api/translate';
import useDebounce from 'react-use/lib/useDebounce';
import styles from './styles.module.css';
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';

type Props = {
  onSave: ({
    word,
    translate,
  }: {
    word: string;
    translate: string;
  }) => Promise<void>;
  onCancel: () => void;
};

const NewWord: React.FunctionComponent<Props> = ({
  onSave,
  onCancel,
}: Props) => {
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);
  const [word, setWord] = useState('');
  const [translate, setTranslate] = useState('');
  const { token } = useSelector(
    ({ translate: translateState }: { translate: { token: string } }) =>
      translateState
  );

  const [, cancel] = useDebounce(
    async () => {
      const res = (await getTranslate(token, word, '1033', '1049')) as {
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

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        if (word && translate) {
          onSave({ word, translate });

          setWord('');
          setTranslate('');
        }
      }
    },
    [onSave, translate, word]
  );

  const handleOnClickSave = useCallback(() => {
    if (word && translate) {
      onSave({ word, translate });

      setWord('');
      setTranslate('');
    }
  }, [onSave, word, translate]);

  const handleOnClickCancel = useCallback(() => {
    setWord('');
    setTranslate('');
    onCancel();
  }, [onCancel]);

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={word}
          onChange={handleOnChangeWord}
          ref={inputRef}
          onKeyDown={handleKeyDown}
          placeholder="Word"
        />
        <input
          className={styles.input}
          value={translate}
          onChange={handleOnChangeTranslate}
          onKeyDown={handleKeyDown}
          placeholder="Translate"
        />
      </div>
      <div className={styles.buttons}>
        <SaveButton onSave={handleOnClickSave} />
        <CancelButton onCancel={handleOnClickCancel} />
      </div>
    </div>
  );
};

export default memo(NewWord);
