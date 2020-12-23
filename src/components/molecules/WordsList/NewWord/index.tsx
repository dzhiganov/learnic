import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'core/store/api/translate';
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
      {word && translate ? (
        <div className={styles.save}>
          <div className={styles.saveIcon}>
            <svg
              viewBox="0 0 64 64"
              aria-labelledby="title"
              aria-describedby="desc"
              role="img"
            >
              <title>Enter Key</title>
              <desc>A line styled icon from Orion Icon Library.</desc>
              <rect
                data-name="layer2"
                x="2"
                y="2"
                width="60"
                height="60"
                rx="7.8"
                ry="7.8"
                fill="none"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                data-name="layer1"
                fill="none"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M16 32h30v-8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                data-name="layer1"
                fill="none"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M24 40l-8-8 8-8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className={styles.saveTitle}>Press Enter to save</span>
        </div>
      ) : null}
    </div>
  );
};

export default memo(NewWord);
