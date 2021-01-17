import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'core/store/api/translate';
import useDebounce from 'react-use/lib/useDebounce';
import styles from './styles.module.css';
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';

type Props = {
  initialState?: null | {
    word: string;
    translate: string;
  };
  onSave: ({
    word,
    translate,
  }: {
    word: string;
    translate: string;
  }) => Promise<void>;
  onCancel: () => void;
  autoFetch?: boolean;
};

const NewWord: React.FunctionComponent<Props> = ({
  initialState,
  onSave,
  onCancel,
  autoFetch,
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
      if (!autoFetch) {
        return;
      }
      const res = (await getTranslate(token, word, 'ru', 'en')) as {
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

  useEffect(() => {
    if (initialState) {
      setWord(initialState?.word);
      setTranslate(initialState?.translate);
    }
  }, [initialState]);

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

NewWord.defaultProps = {
  initialState: null,
  autoFetch: true,
};

export default memo(NewWord);
