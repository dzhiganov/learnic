import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'core/store/api/translate';
import useDebounce from 'react-use/lib/useDebounce';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';
import Tags from './Tags';
import { Tags as TagsList } from '~shared/types';

type Props = {
  id: string;
  initialState?: null | {
    word: string;
    translate: string;
    tags: TagsList;
  };
  onSave: ({
    id,
    word,
    translate,
    tags,
  }: {
    id?: string;
    word: string;
    translate: string;
    tags: string[][];
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
  const [tagsIds, setTagsIds] = useState<string[]>([]);
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
      setTagsIds(initialState?.tags.map(({ id: tagId }) => tagId));
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
          onSave({ id, word, translate, tags: [tagsIds, []] });

          setWord('');
          setTranslate('');
        }
      }
    },
    [id, onSave, translate, word, tagsIds]
  );

  const handleOnClickSave = useCallback(() => {
    const result: string[][] = [[], []];
    const [addedTags, removedTags] = result;
    const initialTagsIds = initialState?.tags.map(({ id: tagId }) => tagId);

    // TODO Optimize it!
    initialTagsIds?.forEach((tagId) => {
      if (tagsIds.includes(tagId)) return;
      removedTags.push(tagId);
    });

    tagsIds.forEach((tagId) => {
      if (initialTagsIds?.includes(tagId)) return;
      addedTags.push(tagId);
    });

    if (word && translate) {
      onSave({ id, word, translate, tags: result });

      setWord('');
      setTranslate('');
    }
  }, [id, onSave, word, translate, tagsIds, initialState?.tags]);

  const handleOnClickCancel = useCallback(() => {
    setWord('');
    setTranslate('');
    onCancel();
  }, [onCancel]);

  return (
    <>
      <header className={styles.header}>Adding new word</header>
      <div className={styles.container}>
        <div className={styles.inputsContainer}>
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="textAreaWord">
              <span>{t('DICTIONARY.NEW_WORD_WINDOW.WORD_PLACEHOLDER')}</span>
            </label>

            <textarea
              id="textAreaWord"
              data-testid="word"
              name="word"
              className={styles.input}
              value={word}
              onChange={handleOnChangeWord}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              rows={3}
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="textAreaTranslate">
              <span>
                {t('DICTIONARY.NEW_WORD_WINDOW.TRANSLATE_PLACEHOLDER')}
              </span>
            </label>

            <textarea
              id="textAreaTranslate"
              data-testid="translate"
              name="translate"
              className={styles.input}
              value={translate}
              onChange={handleOnChangeTranslate}
              onKeyDown={handleKeyDown}
              rows={3}
            />
          </div>
          <Tags wordId={id} tagsIds={tagsIds} setTags={setTagsIds} />
        </div>
        <div className={styles.buttons}>
          <SaveButton onSave={handleOnClickSave} />
          <CancelButton onCancel={handleOnClickCancel} />
        </div>
      </div>
    </>
  );
};

NewWord.defaultProps = {
  initialState: null,
  autoFetch: true,
};

export default memo(NewWord);
