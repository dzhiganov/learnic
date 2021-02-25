import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'core/store/api/translate';
import useDebounce from 'react-use/lib/useDebounce';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';

type Props = {
  id: string;
  initialState?: null | {
    word: string;
    translate: string;
  };
  onSave: ({
    id,
    word,
    translate,
  }: {
    id?: string;
    word: string;
    translate: string;
  }) => void;
  onCancel: () => void;
  autoFetch?: boolean;
};

const NewWord: React.FunctionComponent<Props> = ({
  id,
  initialState,
  onSave,
  onCancel,
  autoFetch,
}: Props) => {
  const { t } = useTranslation();
  const inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
  const [word, setWord] = useState('');
  const [translate, setTranslate] = useState('');
  const selectedData = useSelector(
    ({ translate: translateState }: { translate: { token: string } }) =>
      translateState
  );
  const { token = '' } = selectedData || {};

  const [, cancel] = useDebounce(
    async () => {
      if (!autoFetch || !word) {
        return;
      }
      const res = (await getTranslate(token, word, 'ru', 'en')) as {
        Translation: {
          Translation: string;
        };
      };
      const { Translation: { Translation: dictionaryTranslate = '' } = {} } =
        res || {};
      const [value = ''] = dictionaryTranslate.split(',');

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
          onSave({ id, word, translate });

          setWord('');
          setTranslate('');
        }
      }
    },
    [id, onSave, translate, word]
  );

  const handleOnClickSave = useCallback(() => {
    if (word && translate) {
      onSave({ id, word, translate });

      setWord('');
      setTranslate('');
    }
  }, [id, onSave, word, translate]);

  const handleOnClickCancel = useCallback(() => {
    setWord('');
    setTranslate('');
    onCancel();
  }, [onCancel]);

  return (
    <div className={styles.container}>
      <div className={styles.inputsContainer}>
        <div className={styles.inputContainer}>
          <div className={styles.lang}>
            <span>EN</span>
          </div>
          <textarea
            data-testid="word"
            name="word"
            className={styles.input}
            value={word}
            onChange={handleOnChangeWord}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder={t('DICTIONARY.NEW_WORD_WINDOW.WORD_PLACEHOLDER')}
          />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.lang}>
            <span>RU</span>
          </div>
          <textarea
            data-testid="translate"
            name="translate"
            className={styles.input}
            value={translate}
            onChange={handleOnChangeTranslate}
            onKeyDown={handleKeyDown}
            placeholder={t('DICTIONARY.NEW_WORD_WINDOW.TRANSLATE_PLACEHOLDER')}
          />
        </div>
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
