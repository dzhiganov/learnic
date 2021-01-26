import React, { memo, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'core/store/api/translate';
import useDebounce from 'react-use/lib/useDebounce';
import styles from './styles.module.css';
import Enter from '../../../atoms/Icons/Enter';
import Escape from '../../../atoms/Icons/Escape';

type Props = {
  word: string;
  onSave: ({ word, translate }: { word: string; translate: string }) => void;
  clearFilter: () => void;
};

const NoWord: React.FunctionComponent<Props> = ({
  word,
  onSave,
  clearFilter,
}: Props) => {
  const [translate, setTranslate] = useState<string>('');
  const { token } = useSelector(
    ({ translate: translateState }: { translate: { token: string } }) =>
      translateState
  );

  const [,] = useDebounce(
    async () => {
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

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        onSave({ word, translate });
        clearFilter();
      } else if (event.key === 'Escape') {
        clearFilter();
      }
    },
    [onSave, translate, word, clearFilter]
  );

  useEffect(() => {
    if (word && translate) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, word, translate]);

  useEffect(() => {
    if (!word || !translate) {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [word, translate, handleKeyDown]);

  if (!translate) {
    return null;
  }

  return (
    <div className={styles.container}>
      <p className={styles.definition}>
        {`Ooops! You don't have word ${word} in your dictionary.`}
        <br />
        It means <span className={styles.translate}>{`“${translate}”`}</span>.
        If you want to add this word to you dictionary press{' '}
        <span className={styles.icon}>
          <Enter />
        </span>
        Enter.
        <br />
        <br />
        Or, If you don&apos;t press{' '}
        <span className={styles.icon}>
          <Escape />
        </span>
        Escape to back the to words list
      </p>
    </div>
  );
};

export default memo(NoWord);
